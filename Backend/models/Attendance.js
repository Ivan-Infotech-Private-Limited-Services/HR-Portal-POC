const { Schema, model } = require("mongoose");

// const AttendanceSchema = new Schema({
//   userDbId: {
//     type: Schema.Types.ObjectId,
//     ref: "users",
//   },
//   userId: String,
//   corporateId:String,
//   registerType: {
//     type: String,
//     enum: ["halfDay", "time", "wholeDay", "monthly"],
//     required: true,
//   },
//   attendanceDate: Date,
//   attendanceMonth: Number,
//   attendanceYear: Number,
//   loginTime: String,
//   logoutTime: String,
//   attendanceStat:String,
//   breakTime: Number,
//   grossHours: Number,
//   workingHours: Number,
//   incentiveHour: Number,
//   loginBy: {
//     type: String,
//     enum: ["csv", "biometric", "web"],
//     required: true,
//   },
//   shift: {
//     shiftStartTime: String,
//     ShiftEndTime: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

const AttendanceSchema = new Schema({
  userDbId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  userId: String,
  corporateId:String,
  registerType: {
    type: String,
    enum: ["halfDay", "time", "wholeDay", "monthly"],
    required: true,
  },
  attendanceMonth: Number,
  attendanceYear: Number,
  attendances:[
    {
      attendanceDate: Date,
      loginTime: String,
      logoutTime: String,
      attendanceStat:String,
      breakTime: Number,
      grossHours: Number,
      workingHours: Number,
      incentiveHour: Number,
    }
  ],
  monthlySummary:{
    totalWorkingDays: { type: Number, default: 0 }, // Total number of working days in the month
    totalPayDays: { type: Number, default: 0 }, // Total number of working days in the month
    totalPresent: { type: Number, default: 0 }, // Total number of days the employee was present
    totalAbsent: { type: Number, default: 0 }, // Total number of absent days
    totalHolidays: { type: Number, default: 0 }, // Total holidays in the month
    totalWeeklyOffs: { type: Number, default: 0 }, // Total weekly offs in the month
    totalIncentiveHours: { type: Number, default: 0 }, // Total overtime hours worked
  },
  loginBy: {
    type: String,
    enum: ["csv", "biometric", "web"],
    required: true,
  },
  shift: {
    shiftStartTime: String,
    ShiftEndTime: String,
  },
  status:{
    type: String,
    enum: ["pending", "run", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AttendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Attendance = model("attendances", AttendanceSchema);

module.exports = Attendance;
