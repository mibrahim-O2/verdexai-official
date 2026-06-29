/**
 * Usage: requireRole("hr", "admin")
 * Must run AFTER verifyFirebaseToken (relies on req.user being set).
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Insufficient permissions." });
    }
    next();
  };
}

module.exports = requireRole;