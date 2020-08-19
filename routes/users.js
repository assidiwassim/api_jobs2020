var express = require('express');
var router = express.Router();

router.post('/register', function(req, res, next) {
  res.json({ message: 'register api' })
});

router.post('/login', function(req, res, next) {
  res.json({ message: 'register api' })
});


module.exports = router;
