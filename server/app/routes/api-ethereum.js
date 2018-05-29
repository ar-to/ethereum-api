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
router.get('/syncing', ethereumApi.isSyncing);
router.get('/balance/:address', ethereumApi.getBalance);
router.get('/block', ethereumApi.getBlockNumber);
router.get('/block/:blockNumber', ethereumApi.getBlock);
router.get('/tx/:transactionHash', ethereumApi.getTransaction);
router.get('/tx-from-block/:hashStringOrNumber', ethereumApi.getTransactionFromBlock);
router.get('/create-account', ethereumApi.createAccount);
router.get('/get-account/:privateKey', ethereumApi.privateKeyToAccount);
router.get('/accounts', ethereumApi.getAccounts);

// endpoints to perform a transaction
router.post('/send-tx-info', ethereumApi.sendTransactionInfo);
router.post('/sign-tx',ethereumApi.signTransaction);//takes tx object and private key and creates rawData
router.post('/send-signed-tx',ethereumApi.sendSignedTransaction);//send signed data

// these endpoints use the keystore addresses
router.post('/send-tx', ethereumApi.sendTransaction);

// Webhook subscriptions
router.get('/subscribe-syncing', ethereumApi.subscribeSyncing)
router.get('/subscribe-block', ethereumApi.subscribeBlock)
router.post('/close-subscriptions/:subscriptionType', ethereumApi.closeSubscriptions)

// Webhook test
router.post('/post-to-webhook', ethereumApi.testWebhookPost)
router.post('/webhook', ethereumApi.testWebhook)

module.exports = router;