const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect(
      "mongodb+srv://ssoumyajit245:P5Fhizp8LqBEALuT@cluster0.boqg66b.mongodb.net/E_Commerce_Site_Final?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => console.log(`MongoDB Connected: ${mongoose.connection.host}`))
    .catch((err) => console.log("MongoDB Error", err));
};

module.exports = connectDB;