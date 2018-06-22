const TokenHelpers = require('../helpers/TokenHelpers');
const ethereum = require('../helpers/ethereum.js');
const connections = require('../helpers/connections.js');
const erc20Tokens = connections.erc20Tokens;
const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;


function Erc20TokensController() {
  "use strict"

  this.test = (req, res, next) => {
    try {
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
    } catch (error) {
      res.status(404).send(error).end();
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

  obj.method = 'requestTransfer';
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

// Erc20TokensController.prototype.transfer = function (req, res, next) {
//   console.log('tttt')
//   res.send('yepp')
// }
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
  let tokenGas = req.body.gas;
  let tokenPrivateKey = req.body.privateKey;
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
    // check for gas
    // check for private key
    // check for address
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
      transferABI = tokenHelpers.transferABI(toAddress, tokenValue)
      Promise.resolve(transferABI).then((val) => {
        obj.transferABI = val;
        //via web3
        let txObject = {
          // "to": web3.utils.toHex('0x3e672122bfd3d6548ee1cc4f1fa111174e8465fb'),
          "to": web3.utils.toHex(contractAddress),
          "gas": web3.utils.toHex(tokenGas),
          // "gasPrice": web3.utils.toHex(gasPrice),
          // "nonce": web3.utils.toHex(nonce),
          // "value": web3.utils.toHex(wei),
          "data": obj.transferABI
        };
        // sign tx and send
        web3.eth.accounts.signTransaction(txObject, tokenPrivateKey)
          .then((result) => {
            obj.txSignature = result
            // res.send(obj)
            ethereum.sendSignedTransaction(result.rawTransaction).then((value) => {
              obj.sendTxHash = value;
              res.send(obj);
            })
            .catch((error) => {
              obj.error = `There was an error getting the encodingABI for the transfer: ${error}`
              throw obj;
            });
          })
      })
        .catch((error) => {
          obj.error = `There was an error getting the encodingABI for the transfer: ${error}`
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

module.exports = Erc20TokensController;
