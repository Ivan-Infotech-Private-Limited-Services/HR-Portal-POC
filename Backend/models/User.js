const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    corporateId: String,
    userId: String,
    password: String,

    userType: {
      type: String,
      enum: ["admin", "subAdmin", "company", "staff", "employee"],
    },
    hodId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    parentHods: [Schema.Types.ObjectId],

    details: {
      incentiveRate: Number,
      wageRate: Number,
      earningHeads: {
        basic: { type: Number, default: 40 },
        hra: { type: Number, default: 30 },
        ca: { type: Number, default: 30 },
      },
    },
    shift: {
      shiftName: { type: String, default: "Morning" },
      shiftStartTime: { type: String, default: "10:15" },
      ShiftEndTime: { type: String, default: "19:15" },
    },

    status: {
      type: String,
      enum: ["pending", "active", "inactive", "deleted"],
      default: "active",
    },
    createdBy: {
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
  },
  {
    toJSON: { virtuals: true }, // Include virtuals in the output
    toObject: { virtuals: true },
  }
);

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for fullName
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = model("users", UserSchema);
module.exports = User;
