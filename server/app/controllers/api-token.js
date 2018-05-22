const token = require('../helpers/token.js');

module.exports = {
  getTest: function (req, res, next) {
    res.send("Token API")
  },
  getWeb3Provider: function (req, res, next) {
    res.json(token.web3Provider);
  },
  getContractJson: function (req, res, next) {
    res.json(token.contractJson);
  },
  getContractInstance: function (req, res, next) {
    res.json(token.tokenContract);
  },
  getNodeAccounts: function (req, res, next) {
    let accounts = token.accounts.then((value) => {
      res.send(value);
    });
  },
  getOwnerAddressBalance: async function (req, res, next) {
    let owner = token.networkToken.ownerAddress;
    await token.getBalance(owner).then((value) => {
      return res.send(value)
    });
  },
  getAddressBalance: async function (req, res, next) {
    if (req.params) {
      let address = "";
      address = req.params.address != null && token.web3.utils.isAddress(req.params.address) ? req.params.address : false;
      if (address === false) {
        res.status(404).end();
      } else {
        await token.getBalance(address).then((value) => {
          return res.send(value)
        });
      }
    } else {
      res.status(404).end();
    }
  },
  getTokenInfo: function (req, res, next) {
    token.getTokenInfo().then((value) => {
      return res.send(value)
    });
  },
  getTokenOwner: function (req, res, next) {
    token.getTokenOwner().then((value) => {
      return res.send(value)
    });
  },
  addTokenToTotalSupply: function (req, res, next) {
    let bal = token.addTokenToTotalSupply(req.params.amount).then((value) => {
      return res.json(value)
    });
  },
  transferTokens: function (req, res, next) {
    // res.send(req.params.amount);
    if (req.query) {
      let queries = {};
      queries.toAddress = req.query.toAddress != null && token.web3.utils.isAddress(req.query.toAddress) ? req.query.toAddress : false;
      queries.amount = req.query.amount != null && req.query.amount > 0 ? parseInt(req.query.amount) : false;
      if (queries.toAddress === false || queries.amount === false) {
        res.status(404).end();
      } else {
        token.transferTokens(queries.toAddress, queries.amount).then((value) => {
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
      address = req.query.toAddress != null && token.web3.utils.isAddress(req.query.toAddress) ? req.query.toAddress : false;
      if (address === false) {
        res.status(404).end();
      } else {
        token.transferOwnership(address).then((value) => {
          return res.json(value)
        });
        // res.send(typeof address);
      }
    } else {
      res.status(404).end();
    }
  },
  killToken: function (req, res, next) {
    token.killToken().then((value) => {
      return res.send(value)
    });
  },
}