const web3 = require('../helpers/web3.js');
const ethereum = require('../helpers/ethereum.js');
const token = require('../helpers/token.js');

module.exports = {
  getTest: function (req, res, next) {
    res.send("Ethereum API")
  },
  getBalance: function (req, res, next) {
    if (req.params) {
      let address = "";
      address = req.params.address != null && token.web3.utils.isAddress(req.params.address) ? req.params.address : false;
      if (address === false) {
        res.status(404).send('invalid address').end();
      } else {
        ethereum.getBalance(address).then((value) => {
          return res.send(value)
        });
      }
    } else {
      res.status(404).send('missing address parameter').end();
    }
  },
  getBlockNumber: function (req, res, next) {
    ethereum.getBlockNumber().then((value) => {
      return res.send(value)
    });
  },
  createAccount: function (req, res, next) {
    ethereum.createAccount().then((value) => {
      return res.send(value)
    });
  },
  getAccounts: function (req, res, next) {
    ethereum.getAccounts().then((value) => {
      return res.send(value)
    });
  },
}