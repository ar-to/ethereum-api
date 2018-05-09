var ethereumApi = require('../controllers/api-ethereum');
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
 * Ethereum API
 */
router.get('/', ethereumApi.getTest);
router.get('/balance/:address', ethereumApi.getBalance);
router.get('/block', ethereumApi.getBlockNumber);
router.get('/create-account', ethereumApi.createAccount);
router.get('/accounts', ethereumApi.getAccounts);

module.exports = router;