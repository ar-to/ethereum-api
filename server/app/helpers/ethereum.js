const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;

// var obj = {};//used for passing data back to controller
var e; //await function

Ethereum = {
  defaultAccount: web3.eth.defaultAccount,//not working
  /**
   * Get ethereum and wei balances for a valid address
   * @param {string} address 
   * @return {Promise} Promise obj with data or error
   */
  getBalance: async function (address) {
    let obj = {};
    let e = await web3.eth.getBalance(address)
      .then(function (result) {
        obj.weiBalance = result;
        obj.etherBalance = web3.utils.fromWei(result, 'ether');
        console.log('obj', obj);
        return obj;
      }).catch(function (err) {
        console.log(err.message);
        return obj.error = err.message;
      });
    return e;
  },
  getBlockNumber: async function () {
    let obj = {};
    let e = await web3.eth.getBlockNumber()
      .then(function (result) {
        obj.blockNumber = result;
        return obj;
      }).catch(function (err) {
        console.log(err.message);
        return obj.error = err.message;
      });
    return e;
  },
  createAccount: async function () {
    return new Promise(((resolve, reject) => {
      e = web3.eth.accounts.create();
      console.log('new', e);
      resolve(e);
    }))
  },
  getAccounts: async function () {
    let obj = {};
    let e = await web3.eth.getAccounts()
      .then(function (result) {
        obj.accounts = result;
        return obj;
      }).catch(function (err) {
        console.log(err.message);
        return obj.error = err.message;
      });
    return e;
  },
}

module.exports = Ethereum;