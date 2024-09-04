const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const User = require("../models/User");
 
const validateToken = async(req, res, next) => {
    try {
      const token =
        req.headers["x-access-token"] ||
        req.query["x-access-token"] ||
        req.body["x-access-token"];
  
      if (!token) {
        throw "token is required!";
      }
      
      let { user } =  jwt.verify(token, process.env.JWTSECRET);
  
      if(!user) throw "Provide a Invalid Token!"
      
      const session = await Session.findOne({userDbId:user, status:"active"});
  
      if(!session) throw "Session Expired! Please Sign in."
  
      user = await User.findById(user).select("-password");
  
      if(!user) throw "Provide a Invalid Token!"
  
      req["userId"] = user._id;
      req["corporateId"] = user.corporateId;
      req["user"] = user;
  
      next()
  
    } catch (err) {
      return res.status(403).send({
        status: "error",
        message: err.message ?? err,
      });
    }
};

module.exports = {validateToken}