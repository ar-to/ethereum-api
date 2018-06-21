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
    // console.log('TokenHelpers ownerAddress:',ownerAddress)
    // console.log('TokenHelpers contractAddress:',contractAddress)
    this.contractAddress = contractAddress
    this.erc20Contract = new Erc20Contract(contractAddress, ownerAddress);
    // this.tokenWeb3 = this.erc20Contract.token;
    this.tokenWeb3 = this.constructor.startToken(this.erc20Contract);
     //console.log('TokenHelpers tokenWeb3:', this.tokenWeb3)
    this.web3 = web3;
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
    return this.tokenWeb3.methods.balanceOf(address).call()
  }

  async transfer(toAddress,value) {
    return this.tokenWeb3.methods.transfer(toAddress, value).send({from: connections.ownerAddress})
  }
}

module.exports = TokenHelpers;