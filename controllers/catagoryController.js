const catagoryModel = require("../models/catagoryModel");
var slugify = require('slugify');

// Create Catagory || POST
exports.createCatagoryController = async(req, res) => {
    try {
      const {name} = req.body;

      // Validation
      if(!name) {
        return res.status(401).send({
            message: "Name is required",
        });
      }

      // Existing catagory
      const existingCatagory = await catagoryModel.findOne({name});
      if(existingCatagory) {
        return res.status(400).send({
            message: "Catagory Already Exist",
            success: false,
        });
      }

      const catagory = await new catagoryModel({name, slug: slugify(name)}).save();
      return res.status(201).send({
        message: "New Catagory Created",
        success: true,
        catagory,
      });

    } catch (error) {
      console.log("Error Occurred", error);
      return res.status(500).send({
        message: "Error in Create Catagory",
        success: false,
        error,
      });
    }
}



// Get All Catagory || GET
exports.catagoryController = async(req, res) => {
    try {
      const catagory = await catagoryModel.find({});
      return res.status(200).send({
        message: "All Catagory Lists",
        success: true,
        catagory,
      });
        
    } catch (error) {
      console.log("Error Occurred", error);
      return res.status(500).send({
        message: "Error in Update Catagory",
        success: false,
        error,
      });   
    }
}



// Get Single Catagory || GET
exports.singleCatagoryController = async(req, res) => {
    try {
      const catagory = await catagoryModel.findOne({slug: req.params.slug});
      return res.status(200).send({
        message: "Get single Catagory Successfully",
        success: true,
        catagory,
      });

    } catch (error) {
      console.log("Error Occurred", error);
      return res.status(500).send({
        message: "Error while getting Single Catagory",
        success: false,
        error,
      });   
    }
}



// Update Catagory || PUT
exports.updateCatagoryController = async(req, res) => {
    try {
      const {name} = req.body;
      const {id} = req.params;
      const catagory = await catagoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new: true});
      return res.status(200).send({
        message: "New Catagory Update Successfully",
        success: true,
        catagory,
      })

    } catch (error) {
      console.log("Error Occurred", error);
      return res.status(500).send({
        message: "Error in Update Catagory",
        success: false,
        error,
      });
    }
}



// Delete Catagory || DELETE
exports.deleteCatagoryController = async(req, res) => {
    try {
      const {id} = req.params;
      await catagoryModel.findByIdAndDelete(id);
      return res.status(200).send({
        message: "Catagory Deleted Successfully",
        success: true,
      });
        
    } catch (error) {
      console.log("Error Occurred", error);
      return res.status(500).send({
        message: "Error in Delete Catagory",
        success: false,
        error,
      });
    }
}
