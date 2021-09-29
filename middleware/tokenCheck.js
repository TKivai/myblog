const jwt = require('jsonwebtoken');

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // console.log(req.cookies.token);
  // console.log(req.headers);
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, cookieinfo) => {
    if (err) return res.sendStatus(403);
    req.user = cookieinfo.userid;
    next()
  });
}