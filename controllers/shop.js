const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        active: {
          products: true,
        },
        isAuthenticated: !!req.sessionUser,
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
        isAuthenticated: !!req.sessionUser,
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
        isAuthenticated: !!req.sessionUser,
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  const user = req.sessionUser;

  user
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
        isAuthenticated: !!req.sessionUser,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  const user = req.sessionUser;

  user
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
  const user = req.sessionUser;

  user
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

exports.postOrder = (req, res, next) => {
  const user = req.sessionUser;
  let fetchedCart;

  user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const user = req.sessionUser;

  user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        active: {
          orders: true,
        },
        orders,
        isAuthenticated: !!req.sessionUser,
      });
    })
    .catch(err => console.log(err));
};
