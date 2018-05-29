const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;
const connections = require('../helpers/connections.js');
const customAbi = connections.networkToken.customAbi;
const abiPackage = require('human-standard-token-abi');
var abi 

/**
 * Get abi for erc20 tokens
 * either via a npm package or 
 * manually by copying the abi from the compiled token.sol inside build/contracts
 */
if(customAbi != null) {
  const abiCustom = require(`../../../deployed-contracts/${customAbi}`);
  abi = abiCustom;
} else {
  abi = abiPackage;
}

function Erc20Contract(contractAddress,fromAddress) {
  this.contractAddress = contractAddress;
  this.fromAddress = fromAddress;
  this.token = new web3.eth.Contract(abi, contractAddress, {
    from: fromAddress
  });
}

module.exports = Erc20Contract;
