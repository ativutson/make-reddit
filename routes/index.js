var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', (req, res, next) => {
  const currentUserId = req.session.userId;

  res.render('index', { title: 'MakeReddit', currentUserId: currentUserId });
});

// login
router.get('/login', (req, res, next) => {
  res.render('login');
});

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = new Error("Username or password incorrect");
      next_error.status = 401;

      return next(next_error);
    } else {
      req.session.userId = user._id;

      return res.redirect('/') ;
    }
  });
});

module.exports = router;
