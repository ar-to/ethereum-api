const TokenHelpers = require('../helpers/TokenHelpers');
const ethereum = require('../helpers/ethereum.js');
const connections = require('../helpers/connections.js');
const erc20Tokens = connections.erc20Tokens;
const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;
const BN = Web3.BN;

const axios = require('axios');



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

Erc20TokensController.prototype.decodeTxInput = function (req, res, next) {
  // "use strict"
  let that = this;
  let obj = new Object();
  let encodedTxInput = req.body.encodedTxInput;
  const ownerAddress = connections.ownerAddress;
  obj.method = 'decodeTxInput';

  try {
    // // check token
    obj.erc20Available = erc20Tokens.filter((token) => {
      return token.name === req.params.tokenName;
    })
    if (obj.erc20Available.length > 0) {
      contractAddress = obj.erc20Available[0].contractAddress;
      tokenHelpers = new TokenHelpers(contractAddress, ownerAddress);
      // call contract method
      console.log('sdsd>>>.')
      return tokenHelpers.decodeTxInput(encodedTxInput)
        .then((input) => {
          obj.decodedTxInput = input
          return res.send(obj)
        })
        .catch((err) => {
          console.log('erc bal controller err: ', err)
          obj.error = err;
          // throw obj;
          res.status(404).send(obj).end();
        })
    } else {
      obj.error = `Token ${tokenRequested} is not available on this api`
      // throw obj;
      res.status(404).send(obj).end();
    }
  } catch (error) {
    res.status(404).send(error).end();
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
      // return tokenHelpers.getBalance(addressRequested = null)
      return tokenHelpers.getBalance(addressRequested)
        .then((balance) => {
          console.log('erc bal controller bal: ', balance)
          obj.tokenBalance = balance
          return res.send(obj)
        })
        .catch((err) => {
          console.log('erc bal controller err: ', err)
          obj.error = err;
          // throw obj;
          res.status(404).send(obj).end();
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
Erc20TokensController.prototype.transfer = async function (req, res, next) {
  // console.log('test params:', req.params)
  // console.log('test body:', req.body)
  let obj = new Object();
  let that = this;
  let tokenRequested = req.params.tokenName;
  // let addressRequested = req.params.address;
  let fromAddress = req.body.fromAddress;
  let toAddress = req.body.toAddress;
  let tokenValue = req.body.value;
  let tokenGas = req.body.gas;
  let senderPrivateKey = req.body.privateKey;
  let gasPriority = req.body.priority;
  let ether = req.body.ether;
  let address;
  let tokenHelpers;
  let contractAddress;
  const ownerAddress = connections.ownerAddress;
  let validatedValue;

  obj.method = 'transfer';
  obj.params = req.params
  obj.body = req.body

  /**
   * Check address parameter is a valid ethereum address
   * Check token name and check it against a json file to make sure its available and has a contract to connect to
   * Instanciate the token helpers class and call contract method
   */
  try {
    // check address is valid
    fromAddress = fromAddress != null && web3.utils.isAddress(fromAddress) ? fromAddress : false;
    toAddress = toAddress != null && web3.utils.isAddress(toAddress) ? toAddress : false;
    if (fromAddress === false || toAddress === false) {
      return Promise.reject(`Address is missing or is not valid ethereum address`);
    }

    // check token
    obj.erc20Available = erc20Tokens.filter((token) => {
      return token.name === tokenRequested;
    })
    if (obj.erc20Available.length > 0) {

      /**
       * Validate value to send to transferABI
       * keep in mind the decimal spaces used by the token.
       * Anything lower than the created amount will default to 0 tokens. 
       * e.g. 2 decimal, transfer .001, will be 0
       */
      if (tokenValue != null) {
        let tokenPrecision = obj.erc20Available[0].precision;
        let precision = Math.pow(10, tokenPrecision);
        validatedValue = tokenValue * precision
      }
      // validatedValue = 200
      contractAddress = obj.erc20Available[0].contractAddress;
      tokenHelpers = new TokenHelpers(contractAddress, ownerAddress);
      // call contract method
      obj.transferABI = await tokenHelpers.transferABI(toAddress, validatedValue);

      return ethereum.getCurrentGasPrices().then(gasPrice => {
        return gasPrice[gasPriority] * 1000000000;
      }).then(async gasPrice => {
        const txCount = await ethereum.getTransactionCount(fromAddress);
        const decodeTxInput = await tokenHelpers.decodeTxInput(obj.transferABI);

        // get gas
        const estimatedDataGas = await tokenHelpers.estimateGasWithAbiData(fromAddress, toAddress, obj.transferABI);
        let gasLimit = tokenGas != null ? tokenGas : estimatedDataGas * 2;
        const gas = await tokenHelpers.estimateTransferGas(gasLimit, toAddress, validatedValue)

        // let wei = web3.utils.toWei(ether, "ether");
        let wei = new BN(web3.utils.toWei(ether, "ether"));

        //build tx object
        let rawTxObject = {
          // "to": web3.utils.toHex('0x3e672122bfd3d6548ee1cc4f1fa111174e8465fb'),
          "to": contractAddress,
          "gas": gas,
          "gasLimit": gasLimit,
          "gasPrice": gasPrice,
          "nonce": txCount,
          "value": wei,
          "data": obj.transferABI
        };
        let txObject = {
          "to": web3.utils.toHex(contractAddress),
          "gas": web3.utils.toHex(gas),
          "gasPrice": web3.utils.toHex(gasPrice),
          "nonce": web3.utils.toHex(txCount),
          // "value": web3.utils.toHex(wei),
          "data": obj.transferABI
        };
        obj.rawTxObject = rawTxObject;
        obj.txObject = txObject;
        obj.decodeTxInput = decodeTxInput;
        // res.send(obj);

        // sign tx and send
        return web3.eth.accounts.signTransaction(txObject, senderPrivateKey)
          .then((result) => {
            obj.txSignature = result
            // res.send(obj)
            ethereum.sendSignedTransaction(result.rawTransaction).then((value) => {
              obj.sendTxHash = value;
              res.send(obj);
            })
              .catch((error) => {
                // obj.error = `There was an error getting the encodingABI for the transfer: ${error}`
                // throw obj;
                throw new Error(`Failed tkkk ${error}`);
              });
          })
      })
        .catch((error) => {
          res.status(404).send(`There was an error processing the transfer: ${error}`).end();
        })
    } else {
      res.status(404).send('There are 0 ERC20 tokens available').end();
    }
  } catch (error) {
    res.status(404).send(error).end();
  }
};

module.exports = Erc20TokensController;
