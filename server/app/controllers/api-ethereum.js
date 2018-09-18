const ethereum = require('../helpers/ethereum.js');
const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;

const Web3Websocket = require('../helpers/web3-websocket.js');
const web3Socket = Web3Websocket.web3Socket;
const WebSocket = Web3Websocket.WebSocket;
const axios = require('axios')

const Webhook = require('../helpers/webhook.js');
const testWebhookUrl = Webhook.testWebhookUrl;

var stringify = require('json-stringify-safe');//handles circular structure to json

module.exports = {
  getTest: function (req, res, next) {
    res.send("Ethereum API")
  },
  testWebhookPost: function (req, res, next) {
    let obj = {};
    axios.post(testWebhookUrl, req.body)
      .then(function (response) {
        obj.message = 'sent to webhook url';
        obj.data = response.data;
        res.send(obj)
      })
      .catch(function (error) {
        obj.error = 'There was an error sending post request to webhook url';
        obj.config = error.config;
        res.status(404).send(obj).end()
      });
  },
  testWebhook: function (req, res, next) {
    console.log('posted into webhook: ', req.body)
    // res.send('req.body')
    res.send(req.body)
  },
  isSyncing: function (req, res, next) {
    ethereum.isSyncing().then((value) => {
      return (value.error != null ? res.status(404).send(value).end() : res.send(value));
    });
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
    let showTx = req.query.showTx != null ? req.query.showTx : false;
    let useString = req.query.useString != null ? req.query.useString : null;
    ethereum.getBlock(req.params.blockNumber, showTx, useString).then((value) => {
      return res.send(value)
    })
  },
  getTransaction: function (req, res, next) {
    ethereum.getTransaction(req.params.transactionHash).then((value) => {
      return res.send(value)
    });
  },
  getTransactionReceipt: function (req, res, next) {
    ethereum.getTransactionReceipt(req.params.transactionHash).then((value) => {
      return res.send(value)
    });
  },
  getTransactionFromBlock: function (req, res, next) {
    console.log('ff', req.params.hashStringOrNumber)
    ethereum.getTransactionFromBlock(req.params.hashStringOrNumber).then((value) => {
      return res.send(value)
    });
  },
  createAccount: function (req, res, next) {
    ethereum.createAccount().then((value) => {
      return res.send(value)
    });
  },
  privateKeyToAccount: function (req, res, next) {
    ethereum.privateKeyToAccount(req.params.privateKey).then((value) => {
      return res.send(value)
    });
  },
  getAccounts: function (req, res, next) {
    ethereum.getAccounts().then((value) => {
      return res.send(value)
    });
  },
  getWallet: function (req, res, next) {
    ethereum.getWallet().then((value) => {
      return res.send(stringify(value))
    });
  },
  createWalletAccounts: function (req, res, next) {
    ethereum.createWalletAccounts().then((value) => {
      return res.send(stringify(value))
    });
  },
  addAccountToWallet: function (req, res, next) {
    ethereum.addAccountToWallet(req.params.privateKey).then((value) => {
      return res.send(stringify(value))
    });
  },
  removeAccountFromWallet: function (req, res, next) {
    ethereum.removeAccountFromWallet(req.params.publicKey).then((value) => {
      return res.send(stringify(value))
    });
  },
  clearWallet: function (req, res, next) {
    ethereum.clearWallet().then((value) => {
      return res.send(stringify(value))
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
  signTransaction: async function (req, res, next) {
    await validateBody(res, req.body)
      .then((obj) => {
        let validPrivateKey = ethereum.validatePrivateKey(obj.privateKey);
        if (validPrivateKey) {
          ethereum.signTransaction(obj).then((value) => {
            return (value.error != null ? res.status(404).send(value).end() : res.send(value))
          });
        }
        else {
          return res.status(404).send(new Object({ error: "Missing or Invalid private Key" })).end()
        }
      })
  },
  sendSignedTransaction: async function (req, res, next) {
    ethereum.sendSignedTransaction(req.body.rawTransaction).then((value) => {
      return (value.error != null ? res.status(404).send(value).end() : res.send(value))
    });
  },
  sendTransaction: async function (req, res, next) {
    await validateBody(res, req.body)
      .then((obj) => {
        ethereum.sendTransaction(obj).then((value) => {
          return (value.error != null ? res.status(404).send(value).end() : res.send(value))
        });
      })
  },
  subscribeSyncing: function (req, res, next) {
    let obj = {};
    ethereum.subscribeSyncing()
      .then((value) => {
        // console.log('value block', value)
        obj.subscriptionOpened = value;
        res.send(obj)
      }, (rej) => {
        obj.subscriptionNotOpened = rej;
        res.status(404).send(obj).end();
      })
  },
  subscribeBlock: function (req, res, next) {
    let obj = {};
    ethereum.subscribeBlock()
      .then((value) => {
        // console.log('value block', value)
        obj.subscriptionOpened = value;
        res.send(obj)
      }, (rej) => {
        obj.subscriptionNotOpened = rej;
        res.status(404).send(obj).end();
      })
  },
  closeSubscriptions: function (req, res, next) {
    let obj = {};
    obj.subscriptionType = req.params.subscriptionType;

    ethereum.closeSubscription(obj.subscriptionType).then((value) => {
      obj.closed = value;
      res.send(obj);
    }, (rej) => {
      obj.notClosed = rej;
      res.send(obj);
    })
  }
}

async function validateBody(res, body) {
  return new Promise((resolve, reject) => {
    if (typeof body === 'object' && Object.keys(body).length != 0) {
      let obj = {};
      obj.from = body.from != null ? body.from : null;
      obj.from = body.from != null && web3.utils.isAddress(body.from) ? body.from : obj.error = 'invalid address';
      obj.to = body.to != null && web3.utils.isAddress(body.to) ? body.to : obj.error = 'invalid address';
      obj.value = body.value != null && typeof body.value === 'string' ? body.value : obj.error = "value missing or is not a string number";
      if (isNaN(obj.value)) {
        obj.error = `value is not a valid number`
      }
      obj.gas = body.gas != null ? body.gas : null;
      obj.gasPrice = body.gasPrice != null && typeof body.gasPrice === 'string' ? body.gasPrice : null;
      obj.privateKey = body.privateKey != null ? body.privateKey : null;
      obj.nonce = body.nonce != null ? body.nonce : null;
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
