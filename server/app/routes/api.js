var api = require('../controllers/api');
var express = require('express');
var router = express.Router();

/**
 * Router options
 * 1 : router.get('/', api.test);
 * 2 : 
 * router.route('/')
 * .get(api.test)
 * .post(api.getOwner)
 */

router.get('/', api.test);
// router.get('/owner', api.getOwner);
// router.get('/kill', api.killContract);
// router.post('/add-tokens', api.addTokenToTotalSupply);
// router.post('/mint', api.mintTokens);

// router.route('/')
// .get(api.test)
// .post(api.getOwner)

router.route('/owner')
.get(api.test)
.post(api.addTokenToTotalSupply)

module.exports = router;