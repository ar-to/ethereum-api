var api = require('../controllers/api');
var express = require('express');
var router = express.Router();

/**
 * Router options
 * 1 : router.get('/', tokenApi.test);
 * 2 : 
 * router.route('/')
 * .get(tokenApi.test)
 * .post(tokenApi.getOwner)
 */

/**
 * Token API
 */
// Basic
router.route('/')
.get(api.getTest)
.post(api.postTest)

router.get('/network', api.networkInfo);

module.exports = router;