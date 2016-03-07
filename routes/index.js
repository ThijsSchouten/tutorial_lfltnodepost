var express = require('express');
var router = express.Router();

// Add these lines!
var pg = require("pg");
var conString = "postgres://postgres:123456@localhost:5432/postgres";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;