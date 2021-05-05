const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    active: {
      addProduct: true
    }
  });
};

exports.postAddProduct = (req, res, next) => {
  const {
    title,
    imageUrl,
    price,
    description
  } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/product-list', {
      products,
      pageTitle: "Admin Products",
      active: {
        adminProducts: true
      }
    });
  });
}