const User = require('./user');
const Document = require('./Document');
const jwt = require('jsonwebtoken');

async function register(req, res, next) {
  const { email, password, name } = req.body;
  const user = new User({ email, password, name });
  await user.save()
    .then((obj)=>{
      console.log(obj)
      res.send({ message: 'User registered successfully' });
    })
    .catch((err)=>{
      console.log(err)
      res.status(400).send({ message: 'Duplicate email' });
    })
}

async function get_doc_list(uid) {
  const doc_list  = await Document.find({ uid: uid })
  return doc_list;
}

async function get_uid(token) {
  if (!token) {
    return 'Unauthorized';
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.userId)
  return user._id.toString();      
}

module.exports = { register,get_uid, get_doc_list };
