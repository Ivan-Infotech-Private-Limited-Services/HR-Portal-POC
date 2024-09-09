const { Schema, model } = require("mongoose");

const SessionSchema = new Schema({
  userDbId: Schema.Types.ObjectId,
  token: String,
  expiresIn: String,
  status: { type: String, enum: ["active", "expired"], default: "active" },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

SessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Session = model("sessions", SessionSchema);

module.exports = Session;
