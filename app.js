const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const handlebars = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// app.engine('hbs', handlebars({
//   layoutsDir: 'views/layouts/',
//   defaultLayout: 'main',
//   extname: 'hbs'
// }));
// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views'); // Default value

// Allow to parse and retrieve body of requests
app.use(bodyParser.urlencoded({
  extended: false
}));
// Define static folder to allow accessing ressources
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

// Default route: '/' => matches every routes
// router.use is triggerd for every kind of request (get/post/...)
app.use((req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: ""
  });
});

app.listen(3000)