const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');
const Cart = require('./cart');

const productsPath = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
  constructor(title, imageUrl, description, price, id) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    Product.fetchAll(products => {
      // "this" refers to the product created in this class
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        products[existingProductIndex] = this;
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }

      fs.writeFile(productsPath, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    fs.readFile(productsPath, (err, fileContent) => {
      if (err || !fileContent || !fileContent.length) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }

  static findById(id, cb) {
    Product.fetchAll(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }

  static deleteById(id) {
    Product.fetchAll(products => {
      const product = products.find(p => p.id === id);
      const updatedProducts = products.filter(p => p.id !== id);
      fs.writeFile(productsPath, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
};
