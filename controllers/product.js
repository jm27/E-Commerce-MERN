const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

const Product = require("../models/product");

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found!",
      });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "image could not be uploaded",
      });
    }
    //check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    let product = new Product(fields);

    // 1 kb = 1000
    // 1 mb = 1000000

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1 mb in size!",
        });
      }
      console.log("Files photo: ", files.photo);
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "product deleted succesfully",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "image could not be uploaded",
      });
    }
    //check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    let product = req.product;
    product = _.extend(product, fields);

    // 1 kb = 1000
    // 1 mb = 1000000

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1 mb in size!",
        });
      }
      console.log("Files photo: ", files.photo);
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

// return products based on sell / arrival
//by sell = /products?sortBy=sold&order=desc&limit=4
//by arrival = /products?sortBy=createdAt&order=desc&limit=4
// if no params are sent, then return all products

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data)=>{
      if(err){
        return res.status(400).json({
          error: 'Product not found!'
        });
      }
      res.send(data)
    })
};

// it will find the products based on the req product category
// all similar will  be returned

exports.listRelated = (req, res) =>{
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;


  Product.find({_id: {$ne: req.product}, category:req.product.category})
  .limit(limit)
  .populate('category', '_id name')
  .exec((err, product)=>{
    if(err){
      return res.status(400).json({
        error: 'Product not found'
      })
    }
    res.json(product)
  })
}

exports.listCategories = (req, res) => {
  Product.distinct('category', {}, (err, categories)=> {
    if (err) {
      return res.status(400).json({
        error: 'Product not found!'
      })
    }
    res.json(categories)
  })
}