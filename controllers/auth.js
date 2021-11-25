exports.getLogin = (req, res, next) => {
  const isAuthenticated = getCookieValue(req, 'isAuthenticated') === 'true';

  res.render('auth/login', {
    pageTitle: 'Login',
    active: {
      login: true,
    },
    isAuthenticated
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'isAuthenticated=true');
  res.redirect('/');
};

function getCookieValue(req, key) {
  return req
    .get('Cookie')
    .split(';')
    .reduce((returnedValue, cookieItem) => {
      const [itemKey, value] = cookieItem.trim().split('=');
      if (itemKey === key) return value;
      return returnedValue;
    }, '');
}
