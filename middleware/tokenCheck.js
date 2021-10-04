const jwt = require('jsonwebtoken');

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({
      msg: "No token provided"
    });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, tokeninfo) => {
    if (err) {
      return res.status(403).json({
        msg: "Invalid token",
      });
    }
    req.user = tokeninfo.userid;
    next()
  });
}