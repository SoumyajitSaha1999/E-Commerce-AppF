const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
//Router import(Auth)
const authRoutes = require("./routes/authRoutes")
//Router import(Catagory)
const catagoryRoutes = require("./routes/catagoryRoutes")
//Router import(Product)
const productRoutes = require("./routes/productRoutes")

// Rest Object
const app = express();

//Port
const PORT = 8000;

// MongoDB Connection
connectDB();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/catagory", catagoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use(express.static("dist"));

// Run Listen
app.listen(PORT, () => {
    console.log(`Server started at: http://127.0.0.1:${PORT}`)
});


