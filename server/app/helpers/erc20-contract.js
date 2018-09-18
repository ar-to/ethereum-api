const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;
const connections = require('../helpers/connections.js');
const customAbi = connections.networkToken.customAbi;
const abiPackage = require('human-standard-token-abi');
const InputDataDecoder = require('ethereum-input-data-decoder');
var abi

/**
 * Get abi for erc20 tokens
 * either via a npm package or 
 * manually by copying the abi from the compiled token.sol inside build/contracts
 */
if (customAbi != null) {
  const abiCustom = require(`../../../deployed-contracts/${customAbi}`);
  abi = abiCustom;
} else {
  abi = abiPackage;
}

/**
 * Contructor instance for an ERC20 token
 * It uses the web3 1.0 Contract method so it can work on other token type
 * @param {String} contractAddress 
 * @param {String} fromAddress owner address which transactions will be made from
 * @return {Object} including the instance of the contract ready to interact via the token parameter
 */
function Erc20Contract(contractAddress, fromAddress) {
  this.contractAddress = contractAddress;
  this.fromAddress = fromAddress;
  // console.log('Erc20Contract fromAddress:', fromAddress)
  // console.log('Erc20Contract contractAddress:', contractAddress)
  this.token = new web3.eth.Contract(abi, contractAddress, {
    // from: fromAddress
  });

  this.txInputDecoder = new InputDataDecoder(abi);
}

module.exports = Erc20Contract;
