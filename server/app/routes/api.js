var api = require('../controllers/api');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', api.test);

module.exports = router;