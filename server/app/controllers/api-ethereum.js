const ethereum = require('../helpers/ethereum.js');
const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;

module.exports = {
  getTest: function (req, res, next) {
    res.send("Ethereum API")
  },
  getBalance: function (req, res, next) {
    if (req.params) {
      let address = "";
      address = req.params.address != null && web3.utils.isAddress(req.params.address) ? req.params.address : false;
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
  getBlock: function (req, res, next) {
    ethereum.getBlock(req.params.blockNumber).then((value) => {
      return res.send(value)
    })
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
  sendTransactionInfo: async function (req, res, next) {
    await validateBody(res, req.body)
      .then((obj) => {
        ethereum.sendTransactionInfo(obj).then((value) => {
          return (value.error != null ? res.status(404).send(value).end() : res.send(value))
        });
      })
  },
  sendTransaction: async function (req, res, next) {
    await validateBody(res, req.body)
      .then((obj) => {
        ethereum.sendTransaction(obj).then((value) => {
          return (value.error != null ? res.status(404).send(value).end() : res.send(value))
        });
      })
  },
}

async function validateBody(res, body) {
  return new Promise((resolve, reject) => {
    if (typeof body === 'object' && Object.keys(body).length != 0) {
      let obj = {};
      obj.from = body.from != null && web3.utils.isAddress(body.from) ? body.from : obj.error = 'invalid address';
      obj.to = body.to != null && web3.utils.isAddress(body.to) ? body.to : obj.error = 'invalid address';
      obj.value = body.value != null && typeof body.value === 'string' ? body.value : obj.error = "value missing or is not a string number";
      if (isNaN(obj.value)) {
        obj.error = `value is not a valid number`
      }
      obj.gas = body.gas != null ? body.gas : null;
      obj.gasPrice = body.gasPrice != null && typeof body.gasPrice === 'string' ? body.gasPrice : null;
      if (obj.error) {
        res.status(404).send(obj).end();
      } else {
        resolve(obj);
      }
    } else {
      res.status(404).send('missing or invalid request json object').end();
    }
  })
}