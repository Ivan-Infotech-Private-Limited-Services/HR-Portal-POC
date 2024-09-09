const { Validator } = require("node-input-validator");
const Attendance = require("../models/Attendance");
const Salary = require("../models/Salary");
const { Workbook } = require("excel4node");
const moment = require("moment/moment");
const { downloadXlsxFile } = require("../Helpers/siteHelper");

const runSalaryReport = async (req, res) => {
  try {
    const isValid = new Validator(req.body, {
      payrollMonth: "required",
      payrollYear: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const {
      payrollMonth,
      payrollYear,
      selectedRowIds,
      unselectedRowIds,
      selectedAllRowIds,
    } = req.body;

    const where = {
      corporateId: { $eq: req.user.corporateId },
    };

    where["attendanceMonth"] = { $eq: parseFloat(payrollMonth) };
    where["attendanceYear"] = { $eq: parseFloat(payrollYear) };

    where["monthlySummary"] = { $exists: true, $ne: null };
    where["status"] = { $ne: "pending" };

    if (selectedAllRowIds) {
      if (unselectedRowIds && unselectedRowIds.length > 0) {
        where["userDbId"] = { $nin: unselectedRowIds };
      }
    } else {
      if (selectedRowIds && selectedRowIds.length > 0) {
        where["userDbId"] = { $in: selectedRowIds };
      } else {
        where["userDbId"] = { $in: [] };
      }
    }

    const attendances = await Attendance.find(where)
      .select("userDbId userId monthlySummary status")
      .populate({
        path: "userDbId",
        select: "userId details",
      })
      .exec();

    await Promise.all(
      attendances.map(async (attendance) => {
        // try {
        const payrollDate = new Date(payrollYear, payrollMonth - 1, 1);

        const doc = {
          userDbId: attendance.userDbId._id,
          userId: attendance.userId,
          corporateId: req.corporateId,
          payrollMonth: payrollMonth,
          payrollyear: payrollYear,

          earningHeads: [],
          perDayGrossAmount: 0,
          monthlyGrossAmount: 0,

          earnedIncentiveAmount: 0,
          netTakeHomeAmount: 0,
          ctcAmount: 0,
        };

        // let monthlySalary =
        //   attendance.userDbId.details.wageRate *
        //   attendance.monthlySummary.totalWorkingDays;
        // let payDaysSalary =
        //   attendance.userDbId.details.wageRate *
        //   attendance.monthlySummary.totalPayDays;

        doc.perDayGrossAmount =  attendance.userDbId.details.wageRate|| 0;
        doc.monthlyGrossAmount =
          attendance.monthlySummary.totalPayDays * doc.perDayGrossAmount || 0;
        doc.earnedIncentiveAmount =
          attendance.monthlySummary.totalIncentiveHours *
            attendance.userDbId.details.incentiveRate || 0;

        const basicPer = attendance.userDbId.details.earningHeads.basic;
        const hraPer = attendance.userDbId.details.earningHeads.hra;
        const caPer = attendance.userDbId.details.earningHeads.ca;

        doc.earningHeads = [
          {
            name: "Basic",
            rate: basicPer,
            perDayWage: (doc.perDayGrossAmount * basicPer) / 100,
            monthlyWage: (doc.monthlyGrossAmount * basicPer) / 100,
          },
          {
            name: "HRA",
            rate: hraPer,
            perDayWage: (doc.perDayGrossAmount * hraPer) / 100,
            monthlyWage: (doc.monthlyGrossAmount * hraPer) / 100,
          },
          {
            name: "CA",
            rate: caPer,
            perDayWage: (doc.perDayGrossAmount * caPer) / 100,
            monthlyWage: (doc.monthlyGrossAmount * caPer) / 100,
          },
        ];

        doc.netTakeHomeAmount =
          doc.monthlyGrossAmount + doc.earnedIncentiveAmount;
        doc.ctcAmount = doc.netTakeHomeAmount;

        doc.runBy = req.user._id;

        await Salary.updateOne(
          {
            userDbId: attendance.userDbId,
            corporateId: req.corporateId,
            payrollMonth,
            payrollYear,
          },
          doc,
          { upsert: true, new: true }
        );

        attendance.status = "payrollRun";
        await attendance.save();
      })
    ).then(() => {
      return res.status(200).json({
        status: "success",
        message: "Payroll Run Successfully!",
        body: {},
      });
    });

    if (!attendances.length) {
      return res.status(200).json({
        status: "success",
        message: "Attendance Uploaded Successfully!",
        body: {},
      });
    }
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
      payrollMonth: "required",
      payrollYear: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const { payrollMonth, payrollYear, search } = req.query;

    const where = {
      _id: { $ne: req.user._id },
      corporateId: { $eq: req.user.corporateId },
    };

    if (search && search != "null" && search != " ") {
      where["$or"] = [{ firstName: search }, { lastName: search }];
    }

    where["payrollMonth"] = { $eq: parseFloat(payrollMonth) };
    where["payrollYear"] = { $eq: parseFloat(payrollYear) };

    const salaries = await Salary.find(where)
      .populate({
        path: "userDbId",
        select: "firstName lastName fullName userId",
        populate: { path: "hodId", select: "firstName lastName fullName" },
      })
      .populate({
        path: "runBy",
        select: "firstName lastName fullName",
      })
      .exec();

    return res.status(200).json({
      docs: salaries,
      totaldocs: salaries.length,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
};

const downloadSalaryReport = async (req, res) => {
  try {
    const isValid = new Validator(req.body, {
      payrollMonth: "required",
      payrollYear: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const {
      payrollMonth,
      payrollYear,
      selectedRowIds,
      unselectedRowIds,
      selectedAllRowIds,
    } = req.body;

    const where = {
      corporateId: { $eq: req.user.corporateId },
    };

    where["payrollMonth"] = { $eq: parseFloat(payrollMonth) };
    where["payrollYear"] = { $eq: parseFloat(payrollYear) };

    if (selectedAllRowIds) {
      if (unselectedRowIds && unselectedRowIds.length > 0) {
        where["userDbId"] = { $nin: unselectedRowIds };
      }
    } else {
      if (selectedRowIds && selectedRowIds.length > 0) {
        where["userDbId"] = { $in: selectedRowIds };
      } else {
        where["userDbId"] = { $in: [] };
      }
    }

    const salaries = await Salary.find(where)
      .populate({
        path: "userDbId",
        select: "firstName lastName fullName userId details",
        populate: { path: "hodId", select: "firstName lastName fullName" },
      })
      .exec();

    const WB = new Workbook();
    const WS = WB.addWorksheet("Salary Report");
    const monthName = moment(
      `${payrollYear}-${payrollMonth}`,
      "YYYY-MM"
    ).format("MMM");

    WS.cell(1, 1, 1, 8, true).string(
      `PRABHA ENTERPRISES NON PF Workers for the month of ${monthName} - ${payrollYear}`
    );
    WS.cell(2, 1).string("S.No");
    WS.cell(2, 2).string("Name of Workers");
    WS.cell(2, 3).string("Card No.");
    WS.cell(2, 4).string("Days");
    WS.cell(2, 5).string("Incentive Hours");
    WS.cell(2, 6).string("incentive/hour");
    WS.cell(2, 7).string("Minimum wages as per day basic");
    WS.cell(2, 8).string("Basic 40%");
    WS.cell(2, 9).string("HRA 30 %");
    WS.cell(2, 10).string("CA 30%");
    WS.cell(2, 11).string("Medical");
    WS.cell(2, 12).string("Gross");
    WS.cell(2, 13).string("Monthly Basic");
    WS.cell(2, 14).string("Monthly HRA");
    WS.cell(2, 15).string("Monthly  CA");
    WS.cell(2, 16).string("Monthly Medical");
    WS.cell(2, 17).string("Grand Total monthy");
    WS.cell(2, 18).string("Incentive  Amount");
    WS.cell(2, 19).string("Monthly total with Incentive");
    WS.cell(2, 20).string("PF on Basic 12%");
    WS.cell(2, 21).string("ESI 0.75%");
    WS.cell(2, 22).string("Monthly Net salary to be paid");
    WS.cell(2, 23).string("Employer Contribution PF 13.00%");
    WS.cell(2, 24).string("Employer Contribution ESI 3.25%");
    WS.cell(2, 25).string("Bill Amount");
    WS.cell(2, 26).string("CTC per day");
    WS.cell(2, 27).string("Signature");

    await Promise.all(
      salaries.map(async (salary, i) => {
        try {
          const attendance = await Attendance.findOne({
            userDbId: salary.userDbId._id,
            attendanceMonth: payrollMonth,
            attendanceYear: payrollYear,
            status: "payrollRun",
          }).select("monthlySummary");
          let col = 8;
          WS.cell(i + 3, 1).number(i + 1);
          WS.cell(i + 3, 2).string(salary.userDbId.fullName);
          WS.cell(i + 3, 3).string(salary.userId);
          WS.cell(i + 3, 4).number(attendance?.monthlySummary?.totalPayDays);
          WS.cell(i + 3, 5).number(
            attendance?.monthlySummary?.totalIncentiveHours || 0
          );
          WS.cell(i + 3, 6).string(
            salary?.userDbId?.details?.incentiveRate?.toFixed(2) || 0
          );
          WS.cell(i + 3, 7).string(
            salary?.userDbId?.details?.wageRate?.toFixed(2) || 0
          );

          await Promise.all(
            salary.earningHeads.map((head) => {
              WS.cell(i + 3, col).string(head.perDayWage?.toFixed(2) || 0);
              WS.cell(i + 3, col + 5).string(head.monthlyWage?.toFixed(2) || 0);
              col += 1;
            })
          );

          WS.cell(i + 3, 11).string("");
          WS.cell(i + 3, 12).string(salary.perDayGrossAmount?.toFixed(2) || 0);
          WS.cell(i + 3, 16).string("");
          WS.cell(i + 3, 17).string(salary.monthlyGrossAmount?.toFixed(2) || 0);
          WS.cell(i + 3, 18).string(
            salary.earnedIncentiveAmount?.toFixed(2) || 0
          );
          WS.cell(i + 3, 19).string(
            (salary.monthlyGrossAmount + salary.earnedIncentiveAmount)?.toFixed(
              2
            ) || 0
          );
          WS.cell(i + 3, 20).string("0.00");
          WS.cell(i + 3, 21).string("0.00");
          WS.cell(i + 3, 22).string(salary.netTakeHomeAmount?.toFixed(2));
          WS.cell(i + 3, 23).string("0.00");
          WS.cell(i + 3, 24).string("0.00");
          WS.cell(i + 3, 25).string(salary.netTakeHomeAmount?.toFixed(2));
          WS.cell(i + 3, 26).string(
            (
              (salary.ctcAmount || 0) /
              (attendance?.monthlySummary?.totalPayDays || 0)
            )?.toFixed(2) || 0
          );
          WS.cell(i + 3, 27).string("");
        } catch (e) {
          throw e;
        }
      })
    )
      .then(() => {
        downloadXlsxFile(
          WB,
          `./storage/excel-files/Salary-report-${payrollMonth}-${payrollYear}.xlsx`,
          res
        );
      })
      .catch((e) => {
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

module.exports = { runSalaryReport, search, downloadSalaryReport };
