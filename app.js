const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');

const app = express();

app.engine(
  'hbs',
  handlebars({
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials',
    defaultLayout: 'main',
    extname: 'hbs',
  })
);
app.set('view engine', 'hbs');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

app.listen(3000);
