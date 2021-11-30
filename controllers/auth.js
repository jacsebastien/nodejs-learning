const User = require('../models/user');

const dummyUserId = 1;

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    active: {
      login: true,
    },
  });
};

exports.postLogin = (req, res, next) => {
  User.findByPk(dummyUserId)
    .then(user => {
      // Use session to create crypted cookie values
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
