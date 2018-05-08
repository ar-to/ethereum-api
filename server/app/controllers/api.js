const blockchain = require('../helpers/blockchain.js');

module.exports = {
  getTest: function (req, res, next) {
    // res.json(blockchain.json3)
    // res.send(JSON.stringify(blockchain.json1))
    res.send("Token API")
  },
  postTest: function (req, res, next) {
    res.send(req.body);
    // res.send("Hello Worldsss")
  },
  getWeb3Provider: function (req, res, next) {
    res.json(blockchain.web3Provider);
  },
  getContractJson: function (req, res, next) {
    res.json(blockchain.contractJson);
  },
  getContractInstance: function (req, res, next) {
    res.json(blockchain.tokenContract);
  },
  getNodeAccounts: function (req, res, next) {
    let accounts = blockchain.accounts.then((value) => {
      res.send(value);
    });
  },
  getOwnerAddressBalance: async function (req, res, next) {
    let owner = process.env.OWNER_ACCOUNT;
    await blockchain.getBalance(owner).then((value) => {
      return res.send(value)
    });
  },
  getAddressBalance: async function (req, res, next) {
    if (req.params) {
      let address = "";
      address = req.params.address != null && blockchain.web3.utils.isAddress(req.params.address) ? req.params.address : false;
      if (address === false) {
        res.status(404).end();
      } else {
        await blockchain.getBalance(address).then((value) => {
          return res.send(value)
        });
      }
    } else {
      res.status(404).end();
    }
  },
  getTokenInfo: function (req, res, next) {
    blockchain.getTokenInfo().then((value) => {
      return res.send(value)
    });
  },
  getTokenOwner: function (req, res, next) {
    blockchain.getTokenOwner().then((value) => {
      return res.send(value)
    });
  },
  addTokenToTotalSupply: function (req, res, next) {
    let bal = blockchain.addTokenToTotalSupply(req.params.amount).then((value) => {
      return res.json(value)
    });
  },
  transferTokens: function (req, res, next) {
    // res.send(req.params.amount);
    if (req.query) {
      let queries = {};
      queries.toAddress = req.query.toAddress != null && blockchain.web3.utils.isAddress(req.query.toAddress) ? req.query.toAddress : false;
      queries.amount = req.query.amount != null && req.query.amount > 0 ? parseInt(req.query.amount) : false;
      if (queries.toAddress === false || queries.amount === false) {
        res.status(404).end();
      } else {
        blockchain.transferTokens(queries.toAddress, queries.amount).then((value) => {
          return res.json(value)
        });
      }
    } else {
      res.status(404).end();
    }
  },
  transferOwnership: function (req, res, next) {
    /**
     * Need some clarification on when ownership is tranfered 
     * because it does not seem to apply to ERC20 token
     * but forums say it works on crowdsales
     */
    if (req.query) {
      let address = "";
      address = req.query.toAddress != null && blockchain.web3.utils.isAddress(req.query.toAddress) ? req.query.toAddress : false;
      if (address === false) {
        res.status(404).end();
      } else {
        blockchain.transferOwnership(address).then((value) => {
          return res.json(value)
        });
        // res.send(typeof address);
      }
    } else {
      res.status(404).end();
    }
  },
  killToken: function (req, res, next) {
    blockchain.killToken().then((value) => {
      return res.send(value)
    });
  },
}