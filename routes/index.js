var express = require('express');
var router = express.Router();
const exphbs = require('express-handlebars');

var people = ['John', 'Thomas', 'Seigfreid'];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./layouts/home', {
    content: 'This is some content',
    published: true,
    people: people
  });
});

module.exports = router;
