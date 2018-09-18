var tokenApi = require('../controllers/api-token');
var express = require('express');
var router = express.Router();

const Erc20TokensControllerInstance = require('../controllers/api-erc20-tokens');
const erc20TokensController = new Erc20TokensControllerInstance();

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
router.get('/get-contract', tokenApi.getContractJson);//get contract json
router.get('/get-contract-instance', tokenApi.getContractInstance);
router.get('/check-for-contract/:address', tokenApi.checkForContract);

// Web3 basic requests
router.get('/node-accounts', tokenApi.getNodeAccounts);
router.get('/balance', tokenApi.getOwnerAddressBalance);//token function for owner balance
router.get('/balance/:address', tokenApi.getAddressBalance);

// Token Contract requests
router.get('/owner', tokenApi.getTokenOwner);
router.post('/add-tokens/:amount', tokenApi.addTokenToTotalSupply);//increase tokens for token
router.post('/transfer-tokens', tokenApi.transferTokens);
router.post('/transfer-owner', tokenApi.transferOwnership);
router.get('/kill-token', tokenApi.killToken);
// router.post('/mint', tokenApi.mintTokens);

// ERC20 Specific
router.post('/transfer-from', tokenApi.transferFrom)//requires req.body

/**
 * Routes for multiple ERC20 Tokens
 */
router.get('/:tokenName', erc20TokensController.test);
router.get('/:tokenName/getbalance/:address', erc20TokensController.getBalance);
router.post('/:tokenName/transfer',erc20TokensController.transfer)
router.post('/:tokenName/request-transfer',erc20TokensController.requestTransfer)
router.post('/:tokenName/decode-tx-input', erc20TokensController.decodeTxInput);

module.exports = router;