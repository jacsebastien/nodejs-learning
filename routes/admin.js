const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    active: {
      addProduct: true
    }
  });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  console.log(req.body); // { title: 'Book' }
  products.push({
    title: req.body.title,
    description: "Description of the product"
  })
  res.redirect('/');
});

exports.routes = router;
exports.products = products;