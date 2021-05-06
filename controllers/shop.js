const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      active: {
        products: true,
      },
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  console.log(productId);
  res.redirect('/');
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      active: {
        shop: true,
      },
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    active: {
      cart: true,
    },
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    active: {
      checkout: true,
    },
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    active: {
      orders: true,
    },
  });
};
