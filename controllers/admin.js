const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    active: {
      addProduct: true,
    },
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId, product => {
    if (!product) {
      res.redirect('/404');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      active: {
        editProduct: true,
      },
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, description, price, id);
  product.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/product-list', {
      products,
      pageTitle: 'Admin Products',
      active: {
        adminProducts: true,
      },
    });
  });
};

exports.postDeleteProducts = (req, res, next) => {
  const productId = req.params.id;
  Product.deleteById(productId);
  res.redirect('/admin/products');
}
