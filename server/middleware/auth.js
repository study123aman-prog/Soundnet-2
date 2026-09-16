// =============================================
// server/middleware/auth.js - Auth Middleware
// =============================================

// Middleware: Check if user is logged in
const requireLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    next(); // User is logged in, proceed
  } else {
    res.status(401).json({ message: 'Please login to continue' });
  }
};

// Middleware: Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = { requireLogin, requireRole };
