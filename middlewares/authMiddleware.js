const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Protected routes based on token
exports.requireSighIn = async (req, res, next) => {
  try {
    const deCode = JWT.verify(req.headers.authorization, "secret code");
    req.user = deCode;
    next();

  } catch (error) {
    console.log("Error Occurred", error);
  }
};

// Admin access
exports.isAdmin = async(req, res, next) => {
    try {
      const user = await userModel.findById(req.user._id);
      if(user.role !== 1) {
        return res.status(401).send({
          message: "UnAuthorized Access",
          success: false,
        });
      } else {
        next();
      }
        
    } catch (error) {
      console.log("Error Occurred", error);
      res.status(401).send({
        message:"Error in Admin middleware",
        success: false,
        error,
      });
    }
};