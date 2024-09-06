const { Validator } = require("node-input-validator");
const User = require("../models/User");

const search = async (req, res) => {
  try {
    const { search, userType } = req.query;

    const where = {
      _id: { $ne: req.user._id },
      corporateId: { $eq: req.user.corporateId },
    };

    if (search && (search != 'null' && search != ' ')) {
      where["$or"] = [{ firstName: search }, { lastName: search }];
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
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
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

    const existingUser = await User.findOne({corporateId:req.corporateId, userId}).select("-password");
    if(existingUser) throw 'User already exist with this User ID';

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
      message: "User Created Successfully",
      body: user,
    });

  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
}

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({_id:id, corporateId:req.corporateId}).select("-password").populate({
      path: 'hodId',
      select: 'firstName lastName fullName',
    });

    return res.status(200).json({
      status: "success",
      message: "User Found!",
      body: user,
    });
  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
};

const update = async (req, res) => {
  try {

    const isValid = new Validator(req.body, {
      hodId: "required",
      userId: "required",
      firstName: "required",
      incentiveRate: "required",
      wageRate: "required",
    });

    if (!(await isValid.check())) throw isValid.errors;

    const { id } = req.params;

    const existingUser = await User.findOne({_id:id, corporateId:req.corporateId}).select("-password");
    if(!existingUser) throw 'Invalid User Id';
    
    const  {
      hodId = existingUser.hodId, 
      userId = existingUser.userId, 
      firstName = existingUser.firstName, 
      lastName = existingUser.lastName, 
      incentiveRate = existingUser.details.incentiveRate, 
      wageRate = existingUser.details.wageRate, 
      earningHeads = existingUser.details.earningHeads 
    } = req.body;

    if(userId !== existingUser.userId){
      const existingUser = await User.findOne({userId, corporateId:req.corporateId}).select("-password");
      if(existingUser) throw 'User already exist with this User ID';
    }

    let hod;
    if(hodId != existingUser.hodId){
      hod = await User.findById(hodId).select('_id parentHods userType')
      if(!hod || (hod.userType !== 'company' && hod.userType !== 'staff')) throw 'Invalid Hod ID!'
    }
    
    const doc = {
      firstName,
      lastName,
      corporateId:req.corporateId,
      userId,
      hodId:hod?._id || existingUser?.hodId,
      parentHods:hod?.parentHods || existingUser?.parentHods,
      details:{
        incentiveRate,
        wageRate,
        earningHeads
      },
      userType: existingUser.userType
    }

    const user = await User.updateOne({_id:id}, doc);
    return res.status(200).json({
      status: "success",
      message: "User Updated Successfully",
      body: user,
    });

  } catch (e) {
    return res.status(400).send({
      status: "error",
      message: e.message ?? e,
    });
  }
};
module.exports = { search, create , getById, update};
