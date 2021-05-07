const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const cartPath = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static getCart(cb) {
    fs.readFile(cartPath, (err, fileContent) => {
      if (err || !fileContent) {
        cb(null);
      } else {
        const cart = JSON.parse(fileContent);
        cb(cart);
      }
    });
  }

  static addProduct(id, productPrice) {
    fs.readFile(cartPath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err && fileContent) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.products.findIndex(p => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;

      fs.writeFile(cartPath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price) {
    fs.readFile(cartPath, (err, fileContent) => {
      if (err || !fileContent) {
        return;
      }

      const cart = JSON.parse(fileContent);
      const product = cart.products.find(p => p.id === id);
      if(!product) {
        return;
      }
      
      cart.products = cart.products.filter(p => p.id !== id);
      cart.totalPrice -= price * product.qty;
      fs.writeFile(cartPath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }
};
