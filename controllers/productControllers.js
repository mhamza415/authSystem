// asyncHandler is a middleware that is used to handle errors.
import asyncHandler from "express-async-handler";

import Product from "../models/productModel.js";
// @desc    Fetch all Products
// @access  Protected

const getProducts = asyncHandler(async (req, res) => {
  console.log("you are in controller of product");
  const products = await Product.find();
  res.status(200).json(products);
});
// find() is a mongoose method that returns a promise. It is used to find all the products in the database.

// @desc    Fetch a single Product
// @route   GET /api/products/:id
// @access  protected

const getProductById = asyncHandler(async (req, res) => {
  console.log("you are in get product controller");

  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("ohh! product not found");
  }
});

// findById() is a mongoose method that returns a promise. It is used to find a single product in the database.

// @desc    Delete a Product
// @route   DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    const error = new Error("Product not found");
    res.status(404);
    next(error); // Pass the error to the error handler middleware
  }
});

// @desc    Create a Product
// @route   POST /api/products
// @access  Private/Admin

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;

  // Check if required fields are provided
  if (!name || !description) {
    return res.status(400).json("Name and description are required.");
  }

  const existProduct = await Product.findOne({ name: name });
  if (existProduct) {
    return res.status(401).json("Product already exists");
  }

  const product = new Product({
    user: req.user._id,
    name: name,
    price: price,
    description: description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a Product
// @route   PUT /api/products/:id
// @access  Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description } = req.body;
  // Check if required fields are provided
  if (!name || !description) {
    return res.status(400).json("Name and description are required.");
  }
  // check product should not exist
  const existProduct = await Product.findOne({ name: name });
  if (existProduct) {
    return res.status(401).json("Product already exists");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error({ message: "Product not found" });
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
