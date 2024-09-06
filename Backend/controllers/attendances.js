const { Validator } = require("node-input-validator");
const { Workbook } = require("excel4node");
const moment = require("moment/moment");
const fs = require("fs");
const csv = require("csv-parser");

const Attendance = require("../models/Attendance");
const User = require("../models/User");
const { downloadXlsxFile } = require("../Helpers/siteHelper");

function getExcelColumnName(colNumber) {
  let columnName = "";
  while (colNumber > 0) {
    let remainder = (colNumber - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName;
    colNumber = Math.floor((colNumber - 1) / 26);
  }
  return columnName;
}

function getHourDiff(startTime, endTime) {
  // Split the times into hours, minutes, and seconds
  const [startHours = 0, startMinutes = 0, startSeconds = 0] = startTime
    .split(":")
    .map(Number);
  const [endHours = 0, endMinutes = 0, endSeconds = 0] = endTime
    .split(":")
    .map(Number);

  // Convert start time and end time to total minutes
  const startTotalMinutes = startHours * 60 + startMinutes + startSeconds / 60;
  const endTotalMinutes = endHours * 60 + endMinutes + endSeconds / 60;

  // If end time is less than start time, assume end time is the next day
  let diffInMinutes;
  if (endTotalMinutes < startTotalMinutes) {
    diffInMinutes = (1440 - startTotalMinutes) + endTotalMinutes; // 1440 minutes in a day
  } else {
    diffInMinutes = endTotalMinutes - startTotalMinutes;
  }

  // Convert difference from minutes to hours
  const diffInHours = diffInMinutes / 60;

  return diffInHours.toFixed(2);
}


const exportExcel = async (req, res) => {
  try {
    const isValid = new Validator(req.body, {
      attendanceMonth: "required",
      attendanceYear: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const { attendanceMonth, attendanceYear } = req.body;

    const WB = new Workbook();
    const WS = WB.addWorksheet("Employee Attendance");
    const WS2 = WB.addWorksheet("HEADS Details");

    WS2.cell(1, 1).string("Head Abbreviations");
    WS2.cell(2, 1).string("P");
    WS2.cell(3, 1).string("A");
    WS2.cell(4, 1).string("H");
    WS2.cell(5, 1).string("WO");

    WS2.cell(1, 2).string("Head Full Form");
    WS2.cell(2, 2).string("Present");
    WS2.cell(3, 2).string("Absent");
    WS2.cell(4, 2).string("Holiday");
    WS2.cell(5, 2).string("Weekly Off");

    const month = moment(+attendanceYear + "-" + +attendanceMonth, "YYYY-MM");
    const daysInMonth = month.daysInMonth();

    WS.cell(1, 1).string("Employee Name");
    WS.cell(1, 2).string("Card No");

    const users = await User.find({
      corporateId: req.corporateId,
      userType: "employee",
    }).select("firstName lastName fullName userId");

    users.forEach((user, i) => {
      WS.cell(i + 2, 1).string(user?.fullName);
      WS.cell(i + 2, 2).string(user?.userId);
    });

    let colNo = 3;
    for (let date = 1; date <= daysInMonth; date++) {
      WS.cell(1, colNo).string(`${date}LI`);
      WS.cell(1, colNo + 1).string(`${date}LO`);
      WS.cell(1, colNo + 2).string(`${date}TB`);
      WS.cell(1, colNo + 3).string(`${date}Stat`);

      let colLetter = getExcelColumnName(colNo + 3);

      WS.addDataValidation({
        type: "list",
        allowBlank: true,
        prompt: "Choose from dropdown",
        error: "Invalid choice was chosen",
        showDropDown: true,
        sqref: `${colLetter}2:${colLetter}${users?.length + 1}`,
        formulas: ["P,A,H,WO"],
      });

      colNo += 4;
    }

    downloadXlsxFile(WB, "./storage/excel-files/Attendance-Sample.xlsx", res);
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
};

const importExcel = async (req, res) => {
  try {
    const isValid = new Validator(req.body, {
      attendanceMonth: "required",
      attendanceYear: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    let { attendanceMonth, attendanceYear } = req.body;
    attendanceMonth = parseFloat(attendanceMonth);
    attendanceYear = parseFloat(attendanceYear);
    const fileStream = fs.createReadStream(req.files[0].path, {
      encoding: "utf8",
    });

    await fileStream
      .pipe(csv())
      .on("data", async (row) => {
        try {
          const month = moment(
            attendanceYear + "-" + attendanceMonth,
            "YYYY-MM"
          );
          const daysInMonth = month.daysInMonth();

          fileStream.pause();
          
          const user = await User.findOne({
            corporateId: req.corporateId,
            userId: row["Card No"],
          }).select("_id shift");

          if (user) {
            const doc = {
              userDbId: user?._id,
              corporateId: req.corporateId,
              userId: row["Card No"],
              registerType: "time",
              attendanceMonth: attendanceMonth,
              attendanceYear: attendanceYear,
              loginBy: "csv",
              shift: {
                shiftStartTime: user.shift?.shiftStartTime,
                ShiftEndTime: user.shift?.ShiftEndTime,
              },
              attendances:[]
            };

            for (let i = 1; i <= daysInMonth; i++) {
              const attendance = {
                attendanceDate: new Date(
                  attendanceYear,
                  attendanceMonth - 1,
                  i
                ),
                loginTime: row[i + "LI"],
                logoutTime: row[i + "LO"],
                attendanceStat: row[i + "Stat"],
                breakTime: parseFloat(row[i + "TB"] || 0),
                grossHours: 0,
                workingHours: 0,
                incentiveHour: 0,
              }

              if(attendance.loginTime && attendance.logoutTime){
                 attendance.grossHours = getHourDiff(attendance.loginTime, attendance.logoutTime);
                 attendance.workingHours = attendance.grossHours - attendance.breakTime;
                 const shiftHours = getHourDiff(
                   doc.shift.shiftStartTime,
                   doc.shift.ShiftEndTime
                 );
                 if (attendance.grossHours > shiftHours) {
                   attendance.incentiveHour = attendance.grossHours - shiftHours;
                 }
              }

              doc.attendances.push(attendance)

            }

            await Attendance.updateOne(
              {
                userId: doc.userId,
                corporateId: doc.corporateId,
                attendanceMonth,
                attendanceYear
              },
              doc,
              { upsert: true, new: true }
            );
          }


          fileStream.resume();
        } catch (e) {
          fileStream.emit("error", e);
        }
      })
      .on("end", async (e) => {
        return res.status(200).json({
          status: "success",
          message: "Attendance Uploaded Successfully!",
          body: {},
        });
      })
      .on("error", (e) => {
        return res.status(400).send({
          status: "error",
          message: e.message ?? e,
        });
      });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
};

const search = async (req, res) => {
  try {
    const isValid = new Validator(req.query, {
      attendanceMonth: "required",
      attendanceYear: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const { attendanceMonth, attendanceYear, search } = req.query;

    const where = {
      _id: { $ne: req.user._id },
      corporateId: { $eq: req.user.corporateId },
    };

    if (search && (search != 'null' && search != ' ')) {
      where["$or"] = [{ firstName: search }, { lastName: search }];
    }
  
    where["attendanceMonth"] = { $eq: parseFloat(attendanceMonth) };
    where["attendanceYear"] = { $eq: parseFloat(attendanceYear) };

    const attendances = await Attendance.find(where).select("userDbId userId attendances.attendanceStat").populate({
      path: 'userDbId',
      select: 'firstName lastName fullName userId',
    }).exec();

    return res.status(200).json({
      docs: attendances,
      totaldocs: attendances.length,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
}

const createSummary = async (req, res) => {
  try {
    const isValid = new Validator(req.body, {
      attendanceMonth: "required",
      attendanceYear: "required",
      selectedRowIds:"array",
      unselectedRowIds:"array",
      selectedAllRowIds:"required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const { 
      attendanceMonth, 
      attendanceYear, 
      selectedRowIds,
      unselectedRowIds,
      selectedAllRowIds } = req.body;

    const where = {
      corporateId: { $eq: req.user.corporateId },
    };
  
    where["attendanceMonth"] = { $eq: parseFloat(attendanceMonth) };
    where["attendanceYear"] = { $eq: parseFloat(attendanceYear) };

    if (selectedAllRowIds) {
      if (unselectedRowIds && unselectedRowIds.length > 0) {
        where["_id"] = { $nin: unselectedRowIds };
      }
    }else {
      if (selectedRowIds && selectedRowIds.length > 0) {
        where["_id"] = { $in: selectedRowIds };
      } else {
        where["_id"] = { $in: [] };
      }
    }

    const entities = await Attendance.find(where).select("attendances monthlySummary status").populate().exec();

    entities.forEach((entity)=>{
      let totalPresent = 0;
      let totalAbsent = 0;
      let totalWeeklyOffs = 0;
      let totalHolidays = 0;
      let totalIncentiveHours = 0;
      let totalPayDays = 0;

      entity.monthlySummary = entity.attendances.map((attendance) => {
        if(attendance.attendanceStat == 'P'){
          totalPresent += 1
        }
        if(attendance.attendanceStat == 'A'){
          totalAbsent += 1
        }
        if(attendance.attendanceStat == 'WO'){
          totalWeeklyOffs += 1
        }
        if(attendance.attendanceStat == 'H'){
          totalHolidays += 1
        }

        totalIncentiveHours += attendance.incentiveHour;
        totalPayDays = totalPresent + totalWeeklyOffs + totalHolidays;
      });

      entity.monthlySummary.totalWorkingDays = moment(attendanceYear + "-" + attendanceMonth,"YYYY-MM" ).daysInMonth(),
      entity.monthlySummary.totalPresent =  totalPresent.toFixed(2) 
      entity.monthlySummary.totalAbsent =  totalAbsent.toFixed(2) 
      entity.monthlySummary.totalWeeklyOffs =  totalWeeklyOffs.toFixed(2) 
      entity.monthlySummary.totalHolidays =  totalHolidays.toFixed(2) 
      entity.monthlySummary.totalIncentiveHours =  totalIncentiveHours.toFixed(2) 
      entity.monthlySummary.totalPayDays =  totalPayDays.toFixed(2) 
      
      entity.status = 'run';
      entity.save();
    })
    
    return res.status(200).json({
      status: "success",
      message: "Attendance Summary Created Successfully!",
      body: {},
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
}

const getSummary = async (req, res) => {
  try {
    const isValid = new Validator(req.query, {
      attendanceMonth: "required",
      attendanceYear: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const { attendanceMonth, attendanceYear, search } = req.query;

    const where = {
      corporateId: { $eq: req.user.corporateId },
    };

    if (search && (search != 'null' && search != ' ')) {
      where["$or"] = [{ firstName: search }, { lastName: search }];
    }
  
    where["attendanceMonth"] = { $eq: parseFloat(attendanceMonth) };
    where["attendanceYear"] = { $eq: parseFloat(attendanceYear) };

    where["monthlySummary"] = { $exists: true, $ne:null };
    where["status"] = { $eq: 'run' };

    const attendances = await Attendance.find(where).select("userDbId userId monthlySummary status").populate({
      path: 'userDbId',
      select: 'firstName lastName fullName userId',
    }).exec();

    return res.status(200).json({
      docs: attendances,
      totaldocs: attendances.length,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
}

module.exports = { exportExcel, importExcel, search, createSummary, getSummary };
