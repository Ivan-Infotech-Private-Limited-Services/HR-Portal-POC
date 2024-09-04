const { Validator } = require("node-input-validator");
const User = require("../models/User");

const search = async (req, res) => {
  try {
    const { search, userType } = req.query;

    const where = {
      _id: { $ne: req.user._id },
      corporateId: { $eq: req.user.corporateId },
    };

    if (search) {
      where["$or"] = [{ firstName: search }, { username: search }];
    }

    if (userType) {
      where["userType"] = { $eq: userType };
    }

    const users = await User.find(where).select("-password").populate({
      path: 'hodId',
      select: 'firstName lastName fullName',
    });

    return res.status(200).json({
      docs: users,
      totaldocs: users.length,
    });
  } catch (err) {
    return res.status(400).send({
      status: "error",
      message: err.message ?? err,
    });
  }
};

const create = async (req, res) => {
  try {
    const isValid = new Validator(req.body, {
      hodId: "required",
      userId: "required",
      firstName: "required",
      incentiveRate: "required",
      wageRate: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const  {hodId, userId, firstName, lastName, incentiveRate, wageRate, earningHeads } = req.body;

    const hod = await User.findById(hodId).select('_id parentHods userType')
    
    if(!hod || (hod.userType !== 'company' && hod.userType !== 'staff')) throw 'Invalid Hod ID!'

    const doc = {
      firstName,
      lastName,
      corporateId:req.corporateId,
      userId,
      hodId:hod._id,
      parentHods:hod.parentHods,
      details:{
        incentiveRate,
        wageRate,
        earningHeads
      },
      userType:'employee'
    }

    const user = await User.create(doc);
    return res.status(200).json({
      status: "success",
      message: "Sign In Successfully",
      body: user,
    });

  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
}
module.exports = { search, create };
