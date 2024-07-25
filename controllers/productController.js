const productModel = require("../models/productModel");
const catagoryModel = require("../models/catagoryModel");
const orderModel = require("../models/orderModel");
const fs = require("fs");
const slugify = require("slugify");
var braintree = require("braintree"); // Payment Gateway

// Payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "3zj88z46rnj633hz",
  publicKey: "4jpy284rfxg5sxdh",
  privateKey: "25fe730bcc0730a5b2d1243fae452bdd",
});

// Create Product || POST
exports.createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, catagory, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !catagory:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({...req.fields, slug: slugify(name)});
    if(photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    return res.status(201).send({
      message: "Product Created Successfully",
      success: true,
      products,
    });

  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error in Create Product",
      success: false,
      error,
    });
  }
};



// Get All Products || GET
exports.getProductController = async(req, res) => {
  try {
    const products = await productModel.find({}).populate("catagory").select("-photo").limit(12).sort({createdAt: -1});
    return res.status(201).send({
      message: "All Products",
      success: true,
      countTotal: products.length,
      products,
    
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error in getting Products",
      success: false,
      error,
    });
  }
}



// Get Single Product || GET
exports.getSingleProduct = async(req, res) => {
  try {
    const product = await productModel.findOne({slug: req.params.slug}).select("-photo").populate("catagory");
    return res.status(200).send({
      message: "Single Product Fetched",
      success: true,
      product,
      });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error while getting single Products",
      success: false,
      error,
    });
  }
}



// Get Photo || GET
exports.productPhotoController = async(req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if(product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error while getting single Products",
      success: false,
      error,
    });
  }
}



// Update Product || PUT
exports.updateProductController = async(req, res) => {
  try {
    const { name, slug, description, price, catagory, quantity, shipping } = req.fields;
    const { photo } = req.files;
    
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !catagory:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "photo is Required and should be less then 1mb" });
    }
    
    // const updatedProductData = { ...req.fields, slug: slugify(name) };
    const products = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug: slugify(name)}, {new: true});

    if(photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
      return res.status(201).send({
      message: "Product Updated Successfully",
      success: true,
      products,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
    message: "Error in Update Product",
    success: false,
    error,
    });
  }
}



// Delete Product || DELETE
exports.deleteProductController = async(req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    return res.status(200).send({
      message: "Product Deleted Successfully",
      success: true,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(500).send({
      message: "Error while getting single Products",
      success: false,
      error,
    });
  }
}



// Filter Product || GET
exports.productFilterController = async(req, res) => {
  try {
    const {checked, radio} = req.body;
    let args = {};
    if(checked.length > 0) args.catagory = checked;
    if(radio.length) args.price = {$gte: radio[0], $lte: radio[1]};
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(400).send({
      message: "Error while Filtering Products",
      success: false,
      error,
    });
  }
}



// Product Count || GET
exports.productCountController = async(req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(400).send({
      message: "Error in Product count",
      success: false,
      error,
    });
  }
}



// Product list base on page || GET
exports.productListController = async(req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt: -1});
    res.status(200).send({
      success: true,
      products,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(400).send({
      message: "Error in Per page ctrl",
      success: false,
      error,
    });
  }
}



// Search Product || GET
exports.searchProductController = async(req, res) => {
  try {
     const {keyword} = req.params;
     const results = await productModel.find({
      $or: [
        {name: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"}}
      ]
     }).select("-photo");
     res.json(results);
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(400).send({
      message: "Error in search product API",
      success: false,
      error,
    });
  }
}



// Similar Product || GET
exports.relatedProductController = async(req, res) => {
  try {
    const {pid, cid} = req.params;
    const products = await productModel.find({
      catagory: cid,
      _id:{$ne: pid}
    }).select("-photo").limit(3).populate("catagory");
    res.status(200).send({
      success: true,
      products,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(400).send({
      message: "Error while getting related product",
      success: false,
      error,
    });
  }
}



// Catagory wise product || GET
exports.productCatagoryController = async(req, res) => {
  try {
    const catagory = await catagoryModel.findOne({slug: req.params.slug});
    const products = await productModel.find({catagory}).populate("catagory");
    res.status(200).send({
      success: true,
      catagory,
      products,
    });
    
  } catch (error) {
    console.log("Error Occurred", error);
    return res.status(400).send({
      message: "Error while getting product catagory wise",
      success: false,
      error,
    });
  }
}



// Payment routes || GET
// Token
exports.braintreeTokenController = async(req, res) => {
  try {
    gateway.clientToken.generate({}, function(err, response) {
      if(err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    })
    
  } catch (error) {
    console.log("Error Occurred", error);
  }
}



// Payment || POST
exports.braintreePaymentController = async(req, res) => {
  try {
    const {cart, nonce} = req.body;
    let total = 0;
    cart.map(i => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale({
      amount: total,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    },
    
    function(error, result) {
      if(result) {
        const order = new orderModel({
          products: cart,
          payment: result,
          buyer: req.user._id,
        }).save();
        res.json({ok: true})
      } else {
        res.status(500).send(error);
      }
    }
  )
    
  } catch (error) {
    console.log("Error Occurred", error);
  }
}