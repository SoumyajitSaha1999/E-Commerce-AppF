const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../helpers/authHelpers");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

// Register || POST
exports.registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({
        message: "Please fill all fields",
        success: false,
      });
    }

    // Existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        message: "Already Registered, Please Login",
        success: false,
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password);
    // Save user
    const newUser = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save();
    return res.status(201).send({
      message: "New user Register Successfully",
      success: true,
      newUser,
    });

  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error in Registration",
      success: false,
      error,
    });
  }
};



// Login || POST
exports.loginController = async(req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).send({
        message: "Invalid email or password",
        success: false,
      });
    }

    // User registered or not
    const user = await userModel.findOne({ email });
    // console.log("Login user", user);
    if (!user) {
      return res.status(400).send({
        message: "Email is not registered",
        success: false,
      });
    }
        
    // Password valid or not
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, "secret code", {
       expiresIn: "1000d",
    });
    
    return res.status(200).send({
      message: "Login successful",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        id: user._id,
      },
      token,
    });

  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error in Login",
      success: false,
      error,
    });
  }    
};



// Forgot Password || POST
exports.forgotPasswordController = async(req,res) => {
  try {
    const {email, answer, newPassword} = req.body;
    // console.log("email", email);
    // console.log("answer", answer);
    // console.log("password", newPassword);

    // Validation
    if (!email || !answer || !newPassword) {
      return res.status(400).send({
        message: "Please fill all fields",
        success: false,
      });
    }

    // Check
    const user = await userModel.findOne({ email });
    const ans = await userModel.findOne({ answer });
    // console.log("user",user);
    // console.log("answer",ans);
    if(user == null || ans == null) {
      return res.status(404).send({
        message: "Wrong email or answer",
        success: false,
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {password: hashed});
    return res.status(200).send({
      message: "Password Reset Successfully",
      success: true,
    });

  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error in Forgot Password",
      success: false,
      error,
    });
  }
}



// Update Profile || PUT
exports.updateProfileController = async(req, res) => {
  try {
    const {name, email, password, address, phone} = req.body;
    const user = await userModel.findById(req.user._id);

    let hashedPassword = user.password; // default to existing password

    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Password
    // if(password) {
    //   return res.json({error: "password is required"})
    // }

    // const hashedPassword = password ? await hashPassword(password) : undefined;

    const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
      name: name || user.name,
      password: hashedPassword || user.password,
      phone: phone || user.phone,
      address: address || user.address,
    }, {new: true});

    return res.status(200).send({
      message: "Profile Updated Successfully",
      success: true,
      updateUser,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(400).send({
      message: "Error while updating profile",
      success: false,
      error,
    });
  }
}



// Orders || GET
exports.getOrdersControllers = async(req,res) => {
  try {
    const orders = await orderModel.find({buyer: req.user._id}).populate("products", "-photo").populate("buyer", "name");
    res.json(orders);
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error while getting orders",
      success: false,
      error,
    });
  }
}



// All orders handle by admin || GET
exports.getAllOrdersController = async(req,res) => {
  try {
    const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name");
    res.json(orders);
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error while getting orders",
      success: false,
      error,
    });
  }
}



//Order Status Update by Admin || PUT
exports.orderStatusController = async(req, res) => {
  try {
    const {orderId} = req.params;
    // console.log("orderId=", orderId);
    const {status} = req.body;
    // console.log("status=", status);
    const order = await orderModel.findByIdAndUpdate(status, {status: orderId}, { new: true });
    res.json(order);
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error while updating order",
      success: false,
      error,
    });
  }
}
//   const { status } = req.body; // Assuming these are coming from the request body
//   const{orderId} = req.params;
//   console.log("orderId", orderId);
//   console.log("status", status);

//   try {
//       const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
//       if (!order) {
//           return res.status(404).json({ message: "Order not found" });
//       }
//       res.json(order);
//   } catch (error) {
//       res.status(500).json({ message: "Error updating order status", error });
//   }
// };

// exports.orderStatusController = async (req, res) => {
//   const { status } = req.body;
//   const { orderId } = req.params;

//   console.log('Received orderId:', orderId);
//   console.log('Received status:', status);

//   try {
//       // Validate orderId format (assuming it's a MongoDB ObjectId)
//       if (!mongoose.Types.ObjectId.isValid(orderId)) {
//         console.log("orderId", orderId);
//         return res.status(400).json({ message: "Invalid order ID format" });
//       }

//       const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

//       if (!order) {
//           return res.status(404).json({ message: "Order not found" });
//       }
//       res.json(order);
//   } catch (error) {
//       console.error('Error updating order status:', error);
//       res.status(500).json({ message: "Error updating order status", error: error.message });
//   }
// };

// exports.orderStatusController = async (req, res) => {
//   const { status } = req.body;
//   const { orderId } = req.params;

//   console.log('Received orderId:', orderId);
//   console.log('Received status:', status);
//   console.log(typeof(orderId));
//   console.log(typeof(status));
//   const validOrderId = '60c72b2f9b1e8b3e0c7a9b1a';

//   try {
    
//     // Validate orderId format
//     // if (!isValidObjectId(status)) {
//     //   console.log("Invalid orderId format:", orderId);
//     //   return res.status(400).json({ message: "Invalid order ID format" });
//     // }

//     const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.json(order);
//   } catch (error) {
//     console.error('Error updating order status:', error);
//     res.status(500).json({ message: "Error updating order status", error: error.message });
//   }
// };



// exports.orderStatusController = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     console.log("Received orderId:", orderId);

//     // Log the type and length of the orderId for debugging
//     console.log("Type of orderId:", typeof orderId);
//     console.log("Length of orderId:", orderId.length);

//     // Validate orderId format
//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       console.log("Invalid orderId format:", orderId);
//       return res.status(400).json({ message: "Invalid order ID format" });
//     }

//     const { status } = req.body;
//     console.log("Received status:", status);

//     const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(order);

//   } catch (error) {
//     console.log("Error Occurred:", error);
//     return res.status(500).send({
//       message: "Error while updating order",
//       success: false,
//       error: error.message,
//     });
//   }
// };



exports.testController = (req, res) => {
 res.send("protected Routes");
}