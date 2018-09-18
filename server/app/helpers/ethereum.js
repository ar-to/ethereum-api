const Web3 = require('../helpers/web3.js');
const web3 = Web3.web3;
const BigNumber = Web3.BigNumber;
const axios = require('axios');
const Web3Websocket = require('../helpers/web3-websocket.js');
const web3Socket = Web3Websocket.web3Socket;

const Webhook = require('../helpers/webhook.js');
const blockWebhookUrl = Webhook.blockWebhookUrl;
const syncingWebhookUrl = Webhook.syncingWebhookUrl;

const gasAPI = "https://ethgasstation.info/json/ethgasAPI.json";
var e; //await function

Ethereum = {
  /**
   * validate private key by checking its public key is valid
   * Can prob use a more standard way instead
   * @param {string} privateKey is the string of the key passed
   * @return {boolean} true is valid
   */
  validatePrivateKey: function (privateKey) {
    if (privateKey != null) {
      let accountObject = web3.eth.accounts.privateKeyToAccount(privateKey);
      let publicAddress = accountObject.address;
      if (web3.utils.isAddress(publicAddress)) {
        return true;
      }
      return false;
    }
    return false;
  },
  /**
   * syncing refers to the node being up to date with regards to the latest blockchain block number
   * @return {(Object|boolean)} return true if up to date and object of current/highest block height otherwise
   */
  isSyncing: async function () {
    let obj = {};
    return await web3.eth.isSyncing()
      .then(function (result) {
        obj.nodeSynced = result == false ? true : result;
        return obj;
      })
      .catch((err) => {
        // console.log('isSyncing error:', err.message);
        obj.error = err.message;
        return obj;
      })
  },
  getCurrentGasPrices: function () {
    return new Promise((resolve, reject) => {
      return axios.get(gasAPI).then(response => {
        let prices = {
          low: response.data.safeLow / 10,
          medium: response.data.average / 10,
          high: response.data.fast / 10
        }
        return resolve(prices);
      }).catch(error => {
        return reject(error);
      })
    })
  },
  getTransactionCount: async function (fromAddress) {
    const txCount = await web3.eth.getTransactionCount(fromAddress);
    return txCount;
  },
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
        // console.log('obj', obj);
        return obj;
      }).catch(function (err) {
        console.log(err.message);
        return obj.error = err.message;
      });
    return e;
  },
  /**
   * Get latest block
   * @return {(Promise|Object)}
   */
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
  /**
   * Get transaction details by hash
   * @param {string} transactionHash hash for a transaction
   * @return {(Promise|Object)}
   */
  getTransaction: async function (transactionHash) {
    let obj = {};
    return await web3.eth.getTransaction(transactionHash)
      .then(function (result) {
        obj = result;
        return obj;
      }).catch(function (err) {
        // console.log('getTransaction', err.message);
        obj.error = err.message;
        return obj;
      });
  },
  /**
   * Get transaction details by hash
   * @param {string} transactionHash hash for a transaction
   * @return {(Promise|Object)}
   */
  getTransactionReceipt: async function (transactionHash) {
    let obj = {};
    // return await web3.eth.getTransaction(transactionHash)
    return await web3.eth.getTransactionReceipt(transactionHash)
      .then(function (result) {
        obj = result;
        return obj;
      }).catch(function (err) {
        // console.log('getTransaction', err.message);
        obj.error = err.message;
        return obj;
      });
  },
  /**
   * Similar to getBlock 
   * NOTE: seems to only work without error locally with ganache node
   * ERROR in Ropsten Testnet: "Returned error: invalid argument 1: json: cannot unmarshal non-string into Go value of type hexutil.Uint"
   * @param {number} hashStringOrNumber is the block hash or block number
   * @return {(Promise|Object)}
   */
  getTransactionFromBlock: async function (hashStringOrNumber) {
    let obj = {};
    return await web3.eth.getTransactionFromBlock(hashStringOrNumber)
      .then(function (result) {
        obj.accounts = result;
        return obj;
      }).catch(function (err) {
        // console.log('ttt', err.message);
        obj.error = err.message;
        return obj;
      });
  },
  /**
   * get the block data for provide block number
   * @param {number} blockNumber is the block number of block hash
   * @param {boolean} showTxObject is a truth value to show transaction hash only or the entire object in the output
   * @param {string} useString overwrites the blocknumber to use the string from the api: http://web3js.readthedocs.io/en/1.0/web3-eth.html#getblock
   * @return {(Promise|Object)} either error or block data
   */
  getBlock: async function (blockNumber, showTxObject, useString) {
    let obj = {};
    if (isNaN(blockNumber)) {
      obj.error = `'${blockNumber}' is an invalid block number`;
      return obj;
    }
    blockNumber = useString != null ? useString : blockNumber;
    showTxObject = showTxObject != null ? showTxObject : false;
    return await web3.eth.getBlock(blockNumber, showTxObject)
      .then(function (result) {
        obj = result;
        return obj;
      })
      .catch((err) => {
        // console.log('getBlock error:', err.message);
        obj.error = err.message;
        return obj;
      })
  },
  /**
   * Generates new public address and private key and stores private key inside node
   * @return {Promise} object with address and key
   */
  createAccount: async function () {
    return new Promise(((resolve, reject) => {
      e = web3.eth.accounts.create();
      // console.log('new', e);
      resolve(e);
    }))
  },
  /**
   * Gets the public address from private key
   * @param {(string|hex)} privateKey is a valid private key
   */
  privateKeyToAccount: async function (privateKey) {
    return new Promise(((resolve, reject) => {
      // e = web3.eth.accounts.privateKeyToAccount("0x137450319cc21f2d3130a1b54f5796f1534a5b6f4c2cdd57e692f06518fa9d9a");
      e = web3.eth.accounts.privateKeyToAccount(privateKey);
      // console.log('new', e);
      resolve(e);
    }))
  },
  /**
   * Get all accounts generated and saved to node
   * @return {(Promise|Object.<Array>)} obj with array of all accounts
   */
  getAccounts: async function () {
    let obj = {};
    let e = await web3.eth.getAccounts()
      .then(function (result) {
        obj.accounts = result;
        return obj;
      }).catch(function (err) {
        // console.log('ttt', err.message);
        obj.error = err.message;
        return obj
      });
    return e;
  },
  /**
   * Wallet API
   * Creates, adds, removes and clears an inmemory wallet which contains addresses(public, private, index)
   * If you need to store addresses local to the node consider creating new accounts within the node that way
   * they create new Keytore files that you can backup and reuse
   * @see [Wallet ](http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#wallet)
   */
  getWallet: async function () {
    return new Promise(((resolve, reject) => {
      e = web3.eth.accounts.wallet;
      resolve(e);
    }))
  },
  createWalletAccounts: async function () {
    return new Promise(((resolve, reject) => {
      e = web3.eth.accounts.wallet.create(1);
      resolve(e);
    }))
  },
  addAccountToWallet: async function (privateKey) {
    return new Promise(((resolve, reject) => {
      e = web3.eth.accounts.wallet.add(privateKey);
      resolve(e);
    }))
  },
  removeAccountFromWallet: async function (publicKey) {
    return new Promise(((resolve, reject) => {
      e = web3.eth.accounts.wallet.remove(publicKey);
      resolve(e);
    }))
  },
  clearWallet: async function () {
    return new Promise(((resolve, reject) => {
      e = web3.eth.accounts.wallet.clear();
      resolve(e);
    }))
  },
  /**
   * Get information object on the transaction you plan to send before sending
   * This helps check for gas and gas price and verify your transaction is correct
   * @param {Object} txObject is the req.body from the controller that has been validated
   * @return {Object} is the completed object that contains data about the transaction and further validation
   */
  sendTransactionInfo: async function (txObject) {
    let obj = {};
    e = await processTxInfoData(txObject)
      .then(function (result) {
        return result;
      }).catch(function (err) {
        obj.error = err.message
        return obj;
      });
    return e;
  },
  /**
   * Sign transaction with tx object and private key
   * @param {Object} txObject is the transaction object
   * @return {(Promise|Object)} signed object with rawTransaction data to be used for sending transaction
   */
  signTransaction: async function (txObject) {
    let obj = {};
    e = await processTxInfoData(txObject)
      .then(function (result) {
        return web3.eth.accounts.signTransaction(result.paramsToSign, txObject.privateKey)
          .then(function (result) {
            return result;
          }).catch(function (err) {
            // console.log('sign error', err.message);
            obj.error = err.message;
            return obj
          });
      }).catch(function (err) {
        // console.log('tx info error', err.message);
        obj.error = err.message
        return obj;
      });
    return e;
  },
  /**
   * Send signed transaction
   * @param {string} signedTransactionData is the hex encoded data of the raw transaction to send
   * @return {(Promise|Object)} 
   */
  sendSignedTransaction: async function (signedTransactionData) {
    let obj = {};
    return new Promise(((resolve, reject) => {
      let e = web3.eth.sendSignedTransaction(signedTransactionData, (error, hash) => {
        if (!error) {
          // console.log('sent hash', hash);
          obj.txHash = hash;
          resolve(obj);
        } else {
          // console.log('sent error', error.message);
          obj.error = error.message;
          // resolve(obj)
          reject(error)
        }
      })
      return e;
    }));
  },
  /**
   * Send a transaction with node accounts to avoid using private keys
   * The transaction object passed comes from the completed object 
   * @param {Object} txObject is the req.body from the controller that has been validated
   * @return {(Promise|Events|Object)} events come from web3 API; returned object is the completed transaction receipt
   */
  sendTransaction: async function (txObject) {
    let obj = {};
    e = await processTxInfoData(txObject)
      .then(function (result) {
        let e2 = web3.eth.sendTransaction(result.paramsUpdated)
        // .on('receipt', function(receipt){
        //   console.log('tx receipt',receipt);
        // })
        return e2;
      }).catch(function (err) {
        obj.error = err.message
        return obj;
      });
    return e;
  },
  /**
   * Close a subscription by type
   * @param {String} subscriptionType is the Ethereum.parameter used to store the instance of the subscription e.g. syncingSubscription
   * @return {Promise}
   */
  closeSubscription: function (subscriptionType) {
    return new Promise((resolve, reject) => {
      if (Ethereum[subscriptionType] != null) {
        return Ethereum[subscriptionType].unsubscribe(function (error, success) {
          if (success) {
            console.log(`Successfully unsubscribed! for ${subscriptionType}`, success);
            resolve(`Successfully unsubscribed! for ${subscriptionType}`)
          } else {
            console.log('unsubscribed error:', error);
            reject(`Could not unsubscribed. There was an error unsubscribing for ${subscriptionType}`)
          }
        })
      } else {
        reject(`no open subscriptions for ${subscriptionType}`)
      }
    })
  },
  /**
   * Parameters used to store subscription instances
   * which can then be used elsewhere or to unsubscribe
   */
  syncingSubscription: null,
  blockSubscription: null,
  /**
   * Start a subscription to syncing and send data to webhook url
   * @return {Promise}
   */
  subscribeSyncing: function () {
    let obj = {};
    return new Promise((resolve, reject) => {
      return Ethereum.syncingSubscription = web3Socket.eth.subscribe('syncing', function (error, sync) {
        if (error) reject(`There was an error creating a new webhook subscription to syncing: ${error}`)
        if (!error) resolve(`Successfully created a webhook subscription to syncing`)
      })
        .on('data', function (sync) {
          console.log('on syncing subscription: ', sync);
          /**
           * Send post request to url to initiate webhook
           */
          axios.post(syncingWebhookUrl, sync)
            .catch(function (error) {
              obj.error = 'There was an error sending post request to webhook url';
              obj.config = error.config;
              reject(obj);
            });
        });
    })
  },
  /**
   * Start a subscription to new blocks and send data to webhook url
   * @return {Promise}
   */
  subscribeBlock: function () {
    let obj = {};
    return new Promise((resolve, reject) => {
      return Ethereum.blockSubscription = web3Socket.eth.subscribe('newBlockHeaders', function (error, sync) {
        if (error) reject(`There was an error creating a new webhook subscription to newBlockHeaders: ${error}`)
        if (!error) resolve(`Successfully created a webhook subscription to newBlockHeaders`)
      })
        .on('data', function (sync) {
          // console.log('on block subscription: ', sync);
          /**
           * Send post request to url to initiate webhook
           */
          axios.post(blockWebhookUrl, sync)
            .catch(function (error) {
              obj.error = 'There was an error sending post request to webhook url';
              obj.config = error.config;
              reject(obj);
            });
        })
    });
  },
}

module.exports = Ethereum;

/**
 * processes transaction data for information and to use for sending a transaction
 * @param {Object} txObject is the req.body from the controller that has been validated
 * @return {(Promise|Object)}
 */
async function processTxInfoData(txObject) {
  let obj = {};
  return new Promise(async (resolve, reject) => {
    // check value is a number
    if (isNaN(txObject.value)) {
      reject(new Error(`value is not a valid number`))
    }
    // convert ether to ether amount to wei
    let wei = web3.utils.toWei(txObject.value, 'ether');
    // get gas prices 
    const getCurrentGasPrices = async () => {
      let response = await axios.get(gasAPI)
      let prices = {
        low: response.data.safeLow / 10,
        medium: response.data.average / 10,
        high: response.data.fast / 10
      }
      return prices;
    }
    let gasPrices = await getCurrentGasPrices()
    // calculate gas
    let gasPriceDefault = gasPrices.low * 1000000000;
    let gasPriceTypeCustom = txObject.gasPrice != null ? txObject.gasPrice.toLowerCase() : null;
    // validate gasPrice
    let gasPrice;
    if (gasPriceTypeCustom == null) {
      gasPrice = gasPriceDefault
    } else {
      if (gasPrices[gasPriceTypeCustom] === undefined) {
        gasPrice = gasPriceDefault
        reject(new Error('gasPrice is invalid'))
      } else {
        gasPrice = gasPrices[gasPriceTypeCustom] * 1000000000;
      }
    }
    // let gasPrice = gasPriceTypeCustom != null ? gasPrices[gasPriceTypeCustom] * 1000000000 : gasPriceDefault;

    // get nonce
    let nonce;
    await web3.eth.getTransactionCount(txObject.from).then((result) => {
      // add nonce to current nonce if passed to request else return current nonce
      if (txObject.nonce) {
        nonce = result + txObject.nonce;
      } else {
        nonce = result;
      }
    })
      .catch((error) => {
        reject(new Error('failed to get nonce'))
      });

    // set tx object to calculate transaction gas
    let params = {
      "from": txObject.from,
      "to": txObject.to,
      "gasPrice": gasPrice,
      "nonce": nonce,
      "value": wei
    };
    // get transaction gas
    let estimatedGas;
    await web3.eth.estimateGas(params)
      .then((price) => {
        estimatedGas = price;
      })
      .catch((error, receipt) => {
        estimatedGas = null;
        reject(new Error('failed to estimate gas'))
      });
    // validate gas value from controller
    let gas = txObject.gas != null ? txObject.gas : estimatedGas;
    if (gas < estimatedGas) {
      reject(new Error(`gas input is less than estimated gas for this transaction: ${estimatedGas}`));
    }
    else if (isNaN(txObject.gas)) {
      reject(new Error(`gas input is not a number`));
    }
    // set final tx object for sending transaction
    let paramsUpdated = {
      "from": txObject.from,
      "to": txObject.to,
      "gas": gas,
      "gasPrice": gasPrice,
      "nonce": nonce,
      "value": wei
    };
    let paramsToSign1 = {
      "to": txObject.to,
      "gas": gas,
      "gasPrice": gasPrice,
      "nonce": nonce,
      "value": wei
    };
    let paramsToSign = {
      "to": web3.utils.toHex(txObject.to),
      "gas": web3.utils.toHex(gas),
      "gasPrice": web3.utils.toHex(gasPrice),
      "nonce": web3.utils.toHex(nonce),
      "value": web3.utils.toHex(wei)
    };
    obj.amountToSendEther = txObject.value;
    obj.amountToSendWei = wei;
    obj.gasPrices = gasPrices;
    obj.gasPriceTypeDefault = "low";
    obj.gasPriceDefault = gasPriceDefault;
    obj.gasPriceTypeCustom = gasPriceTypeCustom;
    obj.gasPrice = gasPrice;
    obj.estimatedGas = estimatedGas;
    obj.gas = gas;
    obj.params = params;
    obj.paramsToSign1 = paramsToSign1;
    obj.paramsToSign = paramsToSign;
    obj.paramsUpdated = paramsUpdated;
    resolve(obj);
  })
}