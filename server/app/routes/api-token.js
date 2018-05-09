var tokenApi = require('../controllers/api-token');
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
// .get(tokenApi.getTest)
.get(tokenApi.getTokenInfo);

// Web3 & Contract
router.get('/get-web3-provider', tokenApi.getWeb3Provider);
router.get('/get-contract', tokenApi.getContractJson);
router.get('/get-contract-instance', tokenApi.getContractInstance);

// Web3 basic requests
router.get('/node-accounts', tokenApi.getNodeAccounts);
router.get('/balance', tokenApi.getOwnerAddressBalance);//token function for owner balance
router.get('/balance/:address', tokenApi.getAddressBalance);

// Token Contract requests
router.get('/owner', tokenApi.getTokenOwner);
router.post('/add-tokens/:amount', tokenApi.addTokenToTotalSupply);
router.post('/transfer-tokens', tokenApi.transferTokens);
router.post('/transfer-owner', tokenApi.transferOwnership);
router.get('/kill-token', tokenApi.killToken);
// router.post('/mint', tokenApi.mintTokens);

module.exports = router;