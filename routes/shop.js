const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

// router.use is triggerd for every kind of request (get/post/...)
// router.get check for exact route
router.get('/', (req, res, next) => {
  const products = adminData.products;
  // Use default template engine to render the page
  res.render('shop', {
    products,
    pageTitle: "Shop",
    path: '/',
    activeShop: true,
    productCSS: true
  });
});

module.exports = router;