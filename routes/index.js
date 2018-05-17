var express = require('express');
var router = express.Router();
const exphbs = require('express-handlebars');

var people = ['John', 'Thomas', 'Seigfreid'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./layouts/main', {
  });
});

module.exports = router;
