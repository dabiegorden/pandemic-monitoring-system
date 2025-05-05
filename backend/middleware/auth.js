// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

module.exports = { isAuthenticated };
