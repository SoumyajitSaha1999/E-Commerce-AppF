const mongoose = require("mongoose");

const catagoryScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const catagoryModel = mongoose.model("Catagory", catagoryScheme);

module.exports = catagoryModel;
