const erc20Tokens = require('../../../config/erc20Tokens.json');
const TokenHelpers = require('../erc20Tokens/TokenHelpers');
const connections = require('../helpers/connections.js');
const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;

function Erc20TokensController() {
  "use strict"
  // this.web3 = Web3.web3;

  this.test = (req, res, next) => {
    let obj = new Object();
    let tokenRequested = req.params.tokenName;
    obj.method = 'test';
    obj.params = req.params

    obj.erc20Available = erc20Tokens.filter((token) => {
      return token.name === req.params.tokenName;
    })
    if (obj.erc20Available.length > 0) {
      obj.success = `Token ${tokenRequested} is available on this api!`
      res.send(obj)
    } else {
      obj.error = `Token ${tokenRequested} is not available on this api`
      throw obj;
    }
  }
};

/**
 * Get token balance
 * @param {Request} req 
 * @param {Response} res 
 * @param {Next} next 
 * Request: /api/:tokenName/getbalance/address
 */
Erc20TokensController.prototype.getBalance = function (req, res, next) {
  // "use strict"
  // console.log('test params:', req.params)
  let that = this;
  console.log('this.test:', that.test)
  let obj = new Object();
  let tokenRequested = req.params.tokenName;
  let addressRequested = req.params.address;
  let address;
  let tokenHelpers;
  let contractAddress;
  const ownerAddress = connections.ownerAddress;

  obj.method = 'getbalance';
  obj.params = req.params

  /**
   * Check address parameter is a valid ethereum address
   * Check token name and check it against a json file to make sure its available and has a contract to connect to
   * Instanciate the token helpers class and call contract method
   */
  try {
    address = addressRequested != null && web3.utils.isAddress(req.params.address) ? req.params.address : false;
    if (address === false) {
      obj.error = `Address ${addressRequested} is not valid ethereum address`
      throw obj;
    }

    // check token
    obj.erc20Available = erc20Tokens.filter((token) => {
      return token.name === req.params.tokenName;
    })
    if (obj.erc20Available.length > 0) {
      contractAddress = obj.erc20Available[0].contractAddress;
      tokenHelpers = new TokenHelpers(contractAddress, ownerAddress);
      // call contract method
      return tokenHelpers.getBalance(addressRequested)
      .then((balance) => {
        console.log('erc bal controller bal: ', balance)
        obj.tokenBalance = balance
        return res.send(obj)
      })
      .catch((err) => {
        console.log('erc bal controller err: ', err)
        obj.error = err;
        throw obj;
      })
    } else {
      obj.error = `Token ${tokenRequested} is not available on this api`
      throw obj;
    }
  } catch (error) {
    res.status(404).send(error).end();
  }
};

/**
 * Transfer tokens from owner address to any address
 * Requires: owner address is unlocked in the node, the owner address has tokens for the requested token name
 * @param {Request} req 
 * @param {Response} res 
 * @param {Next} next 
 */
Erc20TokensController.prototype.requestTransfer = function (req, res, next) {
  // console.log('test params:', req.params)
  // console.log('test body:', req.body)
  let obj = new Object();
  let tokenRequested = req.params.tokenName;
  // let addressRequested = req.params.address;
  let toAddress = req.body.toAddress;
  let tokenValue = req.body.value;
  let address;
  let tokenHelpers;
  let contractAddress;
  const ownerAddress = connections.ownerAddress;

  obj.method = 'transfer';
  obj.params = req.params
  obj.body = req.body

  /**
   * Check address parameter is a valid ethereum address
   * Check token name and check it against a json file to make sure its available and has a contract to connect to
   * Instanciate the token helpers class and call contract method
   */
  try {
    address = toAddress != null && web3.utils.isAddress(req.body.toAddress) ? toAddress : false;
    if (address === false) {
      obj.error = `Address ${toAddress} is not valid ethereum address`;
      throw obj;
    }
    // check token
    obj.erc20Available = erc20Tokens.filter((token) => {
      return token.name === tokenRequested;
    })
    if (obj.erc20Available.length > 0) {
      contractAddress = obj.erc20Available[0].contractAddress;
      tokenHelpers = new TokenHelpers(contractAddress, ownerAddress);
      // call contract method
      return tokenHelpers.transfer(toAddress, tokenValue)
      .then((balance) => {
        console.log('erc transfer controller transferred: ', balance)
        obj.txHash = balance
        return res.send(obj)
      })
      .catch((err) => {
        console.log('erc transfer controller err: ', err)
        obj.error = err;
        throw obj;
      })
    } else {
      obj.error = `Token ${tokenRequested} is not available on this api`
      throw obj;
    }
  } catch (error) {
    res.status(404).send(error).end();
  }
};

/**
 * Transfer tokens from any address to another address
 * Requires: owner address is unlocked in the node, the owner address has tokens for the requested token name
 * @param {Request} req 
 * @param {Response} res 
 * @param {Next} next 
 */
Erc20TokensController.prototype.transfer = function (req, res, next) {
  // console.log('test params:', req.params)
  // console.log('test body:', req.body)
  let obj = new Object();
  let tokenRequested = req.params.tokenName;
  // let addressRequested = req.params.address;
  let toAddress = req.body.toAddress;
  let tokenValue = req.body.value;
  let address;
  let tokenHelpers;
  let contractAddress;
  const ownerAddress = connections.ownerAddress;

  obj.method = 'transfer';
  obj.params = req.params
  obj.body = req.body

  /**
   * Check address parameter is a valid ethereum address
   * Check token name and check it against a json file to make sure its available and has a contract to connect to
   * Instanciate the token helpers class and call contract method
   */
  try {
    address = toAddress != null && web3.utils.isAddress(req.body.toAddress) ? toAddress : false;
    if (address === false) {
      obj.error = `Address ${toAddress} is not valid ethereum address`;
      throw obj;
    }
    // check token
    obj.erc20Available = erc20Tokens.filter((token) => {
      return token.name === tokenRequested;
    })
    if (obj.erc20Available.length > 0) {
      contractAddress = obj.erc20Available[0].contractAddress;
      tokenHelpers = new TokenHelpers(contractAddress, ownerAddress);
      // call contract method
      obj.transferABI = tokenHelpers.transferABI(toAddress, tokenValue)
      // tokenHelpers.transferABI(toAddress, tokenValue).then((abi) => {
      //   obj.transferABI = abi
      // })
      console.log('obj.transferABI',obj.transferABI)
      // let txObject = {
      //   from: "",

      // }
      // web3.eth.signTransaction(txObject);
      res.send(obj);
      // return tokenHelpers.transfer(toAddress, tokenValue)
      // .then((balance) => {
      //   console.log('erc transfer controller transferred: ', balance)
      //   obj.txHash = balance
      //   return res.send(obj)
      // })
      // .catch((err) => {
      //   console.log('erc transfer controller err: ', err)
      //   obj.error = err;
      //   throw obj;
      // })
    } else {
      obj.error = `Token ${tokenRequested} is not available on this api`
      throw obj;
    }
  } catch (error) {
    res.status(404).send(error).end();
  }
};

module.exports = Erc20TokensController;
