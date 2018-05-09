const Web3 = require('web3');
var BigNumber = require('bignumber.js');//handles web3 balances

var web3Provider;
var web3;//instance

// Initialize web3 and set the provider to the testRPC.
web3Provider = new Web3.providers.HttpProvider(process.env.NODE_URL);
web3 = new Web3(web3Provider);

/**
 * Object holds all parameters and functions needed to communicate by the API
 */
Web3Object = {
  web3Provider: web3Provider,
  web3: web3,
  bigNumber: BigNumber,
}

module.exports = Web3Object;