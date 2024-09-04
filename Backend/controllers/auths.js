const { Validator } = require("node-input-validator");
const User = require("../models/User");
const Session = require("../models/Session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const isValid = new Validator(req.body, {
      corpId: "required",
      userId: "required",
      password: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    let user = await User.findOne({
      $and: [
        {
          corporateId: { $eq: req.body.corpId },
          userId: { $eq: req.body.userId} ,
          status: { $nin: ["pending", "deleted"] },
        },
      ],
    })

    if (!user) throw "Invalid Login Credentials!";
    if (user.status == "inactive")
      throw "Your Account is inactive. Contact with Admin to resolve the issue!";

    if (!bcrypt.compareSync(req.body.password, user.password))
      throw "Invalid Login Credentials!";

    let session = await Session.findOne({
      userDbId: { $eq: user._id },
      status: "active",
    });

    if (!session) {
      let token = jwt.sign({ user: user._id }, process.env.JWTSECRET);
      session = await Session.create({
        userDbId: user._id,
        token,
        status: "active",
      });
    }
    if (user.status === "active") {
      user._doc["x-access-token"] = session.token;
    }
    delete user._doc.password;

    res.status(200).json({
      status: "success",
      message: "Sign In Successfully",
      body: user,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message || err || "Something went wrong",
    });
  }
};

module.exports = { login }