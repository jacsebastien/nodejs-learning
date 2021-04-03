const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

// router.use is triggerd for every kind of request (get/post/...)
// router.get check for exact route
router.get('/', (req, res, next) => {
  console.log('[shop.js]', adminData.products);
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;