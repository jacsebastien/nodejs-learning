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
  const user = req.user;

  user
    .createProduct({ title, price, imageUrl, description })
    // Product.create({ title, price, imageUrl, description, userId: req.user.id })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.id;
  req.user
    .getProducts({ where: { id: productId } })
    // Product.findByPk(productId)
    .then(products => {
      const product = products[0];
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
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body;
  Product.findByPk(id)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    // Product.findAll()
    .then(products => {
      res.render('admin/product-list', {
        products: products,
        pageTitle: 'Admin Products',
        active: {
          adminProducts: true,
        },
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProducts = (req, res, next) => {
  const productId = req.params.id;
  Product.findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};
