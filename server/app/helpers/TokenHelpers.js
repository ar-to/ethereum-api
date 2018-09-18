'use strict'
const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;
const BigNumber = Web3.BigNumber;


const connections = require('../helpers/connections.js');
// const networkToken = connections.networkToken;

// const ownerAddress = networkToken.ownerAddress;

const Erc20Contract = require('../helpers/erc20-contract');

// using truffle-contract
const TruffleContract = require("truffle-contract");


class TokenHelpers {
  constructor(contractAddress, ownerAddress) {
    // instantiate contract instance
    // console.log('TokenHelpers ownerAddress:',ownerAddress)
    // console.log('TokenHelpers contractAddress:',contractAddress)
    this.contractAddress = contractAddress
    this.erc20Contract = new Erc20Contract(contractAddress, ownerAddress);
    // this.tokenWeb3 = this.erc20Contract.token;
    this.tokenWeb3 = this.constructor.startToken(this.erc20Contract);
    this.txInputDecoder = this.erc20Contract.txInputDecoder;
    //console.log('TokenHelpers tokenWeb3:', this.tokenWeb3)
    this.web3 = web3;
    var self = this;
    this.getTest = () => {
      // return "done"
      return new Promise((resolve, rej) => {
        resolve('Token')
      })
        .then((value) => {
          return `${value} Works`
        })
    }
  }

  /**
   * 
   * @param {Object} erc20Contract 
   * @return {Object} is the contract instance that can be used to call erc20 methods
   */
  static startToken(erc20Contract) {
    return erc20Contract.token;
  }

  /**
   * @return {Array} List of public addresses that belong to the node connected to
   */
  async accounts() {
    return web3.eth.getAccounts()
  };

  /**
   * Check if address is a smart contract or regular
   * see: http://web3js.readthedocs.io/en/1.0/web3-eth.html#getcode
   * @param {String} address valid ethereum address
   * @return {Promise}
   */
  async checkForContract(address) {
    return web3.eth.getCode(address)
  }

  /**
   * Decode transaction input data
   * to get to address and token value during a token transfer
   * @param {string} data is the data for the transaction. Can either be the encodedABI or the taken from the input parameter from the transaction details
   */
  async decodeTxInput(data) {
    return this.txInputDecoder.decodeData(data);
  }

  async getTokenOwner() {
    return this.tokenWeb3.methods.owner().call()
  }

  async getBalance(address) {
    if (address) {
      return this.tokenWeb3.methods.balanceOf(address).call()
    } else {
      return Promise.reject('Missing Address')
    }
  }

  /**
   * Get the estimated gas for a transacition when passing the data parameter
   * @see [Options Information ](http://web3js.readthedocs.io/en/1.0/web3-eth.html#sendtransaction)
   * @param {string} fromAddress 
   * @param {string} toAddress 
   * @param {string} abiData 
   * @param {string} ether 
   * @return {Promise}
   */
  async estimateGasWithAbiData(fromAddress, toAddress, abiData, ether = null) {
    return web3.eth.estimateGas({ from: fromAddress, to: toAddress, data: abiData, amount: ether })
  }

  /**
   * Get final gas for contract transfer
   * @see [More Information](http://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-estimategas)
   * @param {gasLimit} gasLimit total gas that transaction will send
   * @param {*} toAddress 
   * @param {*} value 
   * @return {Promise}
   */
  async estimateTransferGas(gasLimit, toAddress, value) {
    return this.tokenWeb3.methods.transfer(toAddress, value).estimateGas({ gas: gasLimit });
  }

  async transfer(toAddress, value) {
    return this.tokenWeb3.methods.transfer(toAddress, value).send({ from: connections.ownerAddress })
  }

  async transferABI(toAddress, value) {
    // return this.tokenWeb3.methods.transfer(toAddress, value).encodeABI();
    if (toAddress && value) {
      return this.tokenWeb3.methods.transfer(toAddress, value).encodeABI();
      // return Promise.reject('sss')
    } else {
      return Promise.reject('Missing Address or value')
    }
  }
}

module.exports = TokenHelpers;