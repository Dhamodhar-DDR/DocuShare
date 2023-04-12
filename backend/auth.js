const jwt = require('jsonwebtoken');
const User = require('./user');

function authenticate(req, res, next) {
  
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    User.findById(decoded.userId)
    .then((user)=>{
      if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    })
    .catch((err)=>{
      return next(err);
    })
  });
}

module.exports = authenticate;