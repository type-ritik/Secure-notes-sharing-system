const jwt = require("jsonwebtoken");

function parseAuthHeader(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const secret = process.env.jWT_SECRET || "dev-secret";

    const payload = jwt.verify(token, secret);

    req.user = { id: payload.sub, username: payload.username };
  } catch (err) {
    req.user = null;
  }
}

module.exports = {parseAuthHeader}
