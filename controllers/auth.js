exports.getLogin = (req, res, next) => {
  const isAuthenticated = req.session.isAuthenticated;

  res.render('auth/login', {
    pageTitle: 'Login',
    active: {
      login: true,
    },
    isAuthenticated
  });
};

exports.postLogin = (req, res, next) => {
  // Use session to create crypted cookie values
  req.session.isAuthenticated = true;
  res.redirect('/');
};
