require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('./user');

async function login(req, res, next) {
  const { email, password } = req.body;
  await User.findOne({ email: email })
  .then((user)=>{
    if (!user) {
      return res.status(401).send({ message: 'No user with this email' });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return next(err);
      }
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid password' });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.send({ token });
    });
  })
  .catch((err)=>{
    if (err) {
      console.log(err);
      return next(err);
    }
  })
}

module.exports = { login };
