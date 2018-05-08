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
// Basic
router.route('/')
.get(api.getTest)
.post(api.postTest)

// Web3 & Contract
router.get('/get-web3-provider', api.getWeb3Provider);
router.get('/get-contract', api.getContractJson);
router.get('/get-contract-instance', api.getContractInstance);

// Web3 basic requests
router.get('/node-accounts', api.getNodeAccounts);
router.get('/balance', api.getOwnerAddressBalance);//token function for owner balance
router.get('/balance/:address', api.getAddressBalance);

// Token Contract requests
router.get('/token', api.getTokenInfo);
router.get('/owner', api.getTokenOwner);
router.post('/add-tokens/:amount', api.addTokenToTotalSupply);
router.post('/transfer-tokens', api.transferTokens);
router.post('/transfer-owner', api.transferOwnership);
router.get('/kill-token', api.killToken);
// router.post('/mint', api.mintTokens);

module.exports = router;