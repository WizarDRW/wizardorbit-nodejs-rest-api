const isAuthenticated = (req, res, next) => {
  const redirectURL = `${req.headers.origin}`;
  if (req.session.user_id == null) {
    return res.redirect(
      `http://localhost:8081/login?serviceURL=${redirectURL}`
    );
  }
  next();
};

module.exports = isAuthenticated;