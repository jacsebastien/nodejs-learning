const User = require('../models/user');

const dummyUserId = 1;

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    active: {
      login: true,
    },
    isAuthenticated: !!req.sessionUser,
  });
};

exports.postLogin = (req, res, next) => {
  User.findByPk(dummyUserId)
    .then(user => {
      // Use session to create crypted cookie values
      req.session.user = user;
      res.redirect('/');
    })
    .catch(err => console.log(err));
};
