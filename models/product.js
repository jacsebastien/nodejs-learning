const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const productsPath = path.join(rootDir, 'data', 'products.json');

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    Product.fetchAll(products => {
      // "this" refers to the product created in this class
      products.push(this);
      fs.writeFile(productsPath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    fs.readFile(productsPath, (err, fileContent) => {
      if(err || !fileContent || !fileContent.length) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
};