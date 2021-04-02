const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Allow to parse and retrieve body of requests
app.use(bodyParser.urlencoded({
  extended: false
}));
// Define static folder to allow accessing ressources
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Default route: '/' => matches every routes
// router.use is triggerd for every kind of request (get/post/...)
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000)