const db = require('../utils/database');
const Cart = require('./cart');

module.exports = class Product {
  constructor(title, imageUrl, description, price, id) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // Insert data and tell MySql to safely insert them to avoid SQL malicious injection from form data
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [
      this.title,
      this.price,
      this.imageUrl,
      this.description,
    ]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }
  
  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

  static deleteById(id) {}
};
