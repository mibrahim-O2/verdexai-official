const { auth } = require("../config/firebase");
const User = require("../models/User");

/**
 * Verifies the Firebase ID token sent in the Authorization header
 * (format: "Bearer <token>"), then attaches the matching MongoDB
 * user document to req.user.
 */
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "No auth token provided." });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decoded = await auth.verifyIdToken(idToken);

    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found in database." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ success: false, error: "Invalid or expired token." });
  }
}

module.exports = verifyFirebaseToken;