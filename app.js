const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

const dummyUserId = 1;

app.engine(
  'hbs',
  handlebars({
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials',
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.set('view engine', 'hbs');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(dummyUserId)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

// Make sequelize associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
// Cart belongs to many Product and store information in CartItem table
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// sync models to database and create relations
sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    // Check if dummy user exists
    return User.findByPk(dummyUserId);
  })
  .then(user => {
    // Create dummy user if not exists
    if (!user) {
      return User.create({ name: 'Seb', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    // Create dummy cart for user
    return user.createCart();
  })
  .then(() => {
    // Start node server only if we succeed to sync to the DB
    app.listen(3000);
  })
  .catch(err => console.log(err));
