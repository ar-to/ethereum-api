const connections = require('../../../config/connections.json');
const networkType = connections.networks.connectApi;
const network = connections.networks[networkType]
const networkUrl = connections.networks[networkType].url;
const Web3 = require('web3');
var BigNumber = require('bignumber.js');//handles web3 balances

var web3Provider;
var web3;//instance

// Initialize web3 and set the provider to the testRPC.
if (process.env.NODE_URL){
  web3Provider = new Web3.providers.HttpProvider(process.env.NODE_URL);
} else {
  web3Provider = new Web3.providers.HttpProvider(networkUrl);
}
web3 = new Web3(web3Provider);

/**
 * Object holds all parameters and functions needed to communicate by the API
 */
Web3Object = {
  web3Provider: web3Provider,
  web3: web3,
  BigNumber: BigNumber,
  network: network
}

module.exports = Web3Object;