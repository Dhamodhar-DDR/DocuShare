const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('./authController');
const userController = require('./userController');
const authenticate = require('./auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', userController.register);
router.get('/get_docs', authenticate, function(req, res) {
  userController.get_doc_list(String(req.user._id))
  .then((doc_list)=>res.send(doc_list))
  .catch((err)=>res.status(400).send(err));
  
});
router.get('/profile', authenticate, function(req, res) {
  res.send(req.user);
});

module.exports = router;
