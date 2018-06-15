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
  constructor(contractAddress,ownerAddress) {
    // instantiate contract instance
    this.contractAddress = contractAddress
    this.erc20Contract = new Erc20Contract(contractAddress, ownerAddress);
    // this.tokenWeb3 = this.erc20Contract.token;
    this.tokenWeb3 = this.constructor.startToken(this.erc20Contract);
    var self = this;
    this.getTest = () => {
      // return "done"
      return new Promise((resolve,rej) => {
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
  accounts() {
    return web3.eth.getAccounts()
  };

  /**
   * Check if address is a smart contract or regular
   * see: http://web3js.readthedocs.io/en/1.0/web3-eth.html#getcode
   * @param {String} address valid ethereum address
   * @return {Promise}
   */
  checkForContract(address) {
    return web3.eth.getCode(address)
  }

  getTokenOwner() {
    return this.tokenWeb3.methods.owner().call()
  }

  async getBalance(address) {
    // return this.tokenWeb3.methods.balanceOf(address);

    // return "balance"
    // return new Promise((resolve,rej) => {
    //   resolve('balance')
    // })
    // let bal = {};
    // bal.tokenBalance = this.tokenWeb3.methods.balanceOf(address);
    return this.tokenWeb3.methods.balanceOf("0x83634a8eaadc34b860b4553e0daf1fac1cb43b1e").call()
    // let t2 = await tokenContract.at(contractAddress).then(function (instance) {
    //   tokenInstance = instance;
    //   let dec = tokenInstance.decimals().then((value) => {
    //     bal.tokenDecimals = value;
    //   });
    //   return tokenInstance.balanceOf(address);
    // }).then(function (result) {
    //   // bal.tokenBalance = result.toFixed(bal.tokenDecimals);
    //   bal.tokenBalance = result;
    // }).catch(function (err) {
    //   console.log(err.message);
    //   return bal.error = err.message;
    // });
    // return bal;
  }
}

module.exports = TokenHelpers;