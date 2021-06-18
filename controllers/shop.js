const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    // DB Select return array of arrays which first element contains data and second metaData
    .then(([products, metaData]) => {
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
  Product.findById(productId)
    .then(([products]) => {
      // DB SELECT always returns an array event if we select only one element
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: 'Product Details',
        active: {
          products: true,
        },
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
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
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = cart.products.reduce((completeCart, cartProduct) => {
        const fullProduct = products.find(p => p.id === cartProduct.id);

        if (fullProduct) {
          return [...completeCart, { ...cartProduct, ...fullProduct }];
        }

        return completeCart;
      }, []);

      console.log(cartProducts);

      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        active: {
          cart: true,
        },
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
    res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
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
