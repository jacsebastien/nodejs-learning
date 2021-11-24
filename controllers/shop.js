const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        active: {
          products: true,
        },
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findByPk(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'Product Details',
        active: {
          products: true,
        },
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        active: {
          shop: true,
        },
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts();
    })
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        active: {
          cart: true,
        },
        products: products,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id: productId } }).then(productsFromCart => ({ cart, productsFromCart })))
    .then(({ cart, productsFromCart }) => {
      if (productsFromCart.length) {
        const product = productsFromCart[0];
        const quantity = product.cartItem.quantity;
        return { cart, product, quantity: quantity + 1 };
      }

      return Product.findByPk(productId)
        .then(product => ({ cart, product, quantity: 1 }))
        .catch(err => console.log(err));
    })
    .then(({ cart, product, quantity }) => {
      // Cart is Linked to CartItem with "through" keyword so we can update quantity from CartItem
      return cart.addProduct(product, { through: { quantity: quantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.params.id;
  req.user
    .getCart()
    .then(cart => cart.getProducts({ where: { id: productId } }))
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })

    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
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
