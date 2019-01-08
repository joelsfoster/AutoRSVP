// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;
//

const router = require('express-promise-router')(); // Instantiate
const Homepage = require('../controllers/Homepage');

router.route('/')
  .get(Homepage.index)

module.exports = router;
