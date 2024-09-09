const { Schema, model } = require("mongoose");

const SalarySchema = new Schema({
  userDbId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  userId:String,
  corporateId:String,

  payrollMonth: Number,
  payrollYear: Number,

  earningHeads:[
    {
        name:String,
        rate:Number,
        perDayWage:Number,
        monthlyWage:Number
    }
  ],

  perDayGrossAmount:Number,
  monthlyGrossAmount:Number,
  earnedIncentiveAmount:Number,
  netTakeHomeAmount:Number,
  ctcAmount:Number,

  status:{
    type: String,
    enum: ["pending", "run", "completed"],
    default: "pending",
  },

  runBy:{
    type: Schema.Types.ObjectId,
    ref: "users",
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

const Salary = model("salaries", SalarySchema);

module.exports = Salary;
