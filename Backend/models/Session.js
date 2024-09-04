const {Schema, model, Types} = require("mongoose");

const SessionSchema = new Schema({
  userDbId: Types.ObjectId,
  token: String,
  expiresIn:String,
  status: { type: String, enum: ["active", "expired"], default: "active" },
});


const Session = model("sessions", SessionSchema);

module.exports = Session