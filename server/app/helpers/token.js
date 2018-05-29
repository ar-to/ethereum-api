const connections = require('../helpers/connections.js');
const networkType = connections.networkType;
const network = connections.network;
const networkUrl = connections.networkUrl;
const networkToken = connections.networkToken;

const Web3 = require('web3');
var BigNumber = require('bignumber.js');//handles web3 balances
const TruffleContract = require("truffle-contract");
const contractJson = require("../../../token-contract/build/contracts/Token.json");

var web3Provider;
var web3;//instance
var tokenArtifact;//json with ABI data
var tokenContract;//instance
var tokenInstance;//actual instance of token contract that allows access to contract functions
const contractAddress = networkToken.tokenContractAddress;
const ownerAddress = networkToken.ownerAddress;

// Initialize web3 and set the provider to the testRPC.
if (process.env.NODE_URL) {
  web3Provider = new Web3.providers.HttpProvider(process.env.NODE_URL);
} else {
  web3Provider = new Web3.providers.HttpProvider(networkUrl);
}
web3 = new Web3(web3Provider);

/**
 * Get Contract instance via truffle-contracts
 * Set the provider for our contract.
 * workaround to "Cannot read property 'apply' of undefined" when initiating contract after contract.deployed()
 * see: https://github.com/trufflesuite/truffle-contract/issues/57
 */
tokenArtifact = contractJson;
tokenContract = TruffleContract(tokenArtifact);
tokenContract.setProvider(web3Provider);
// workaround 
if (typeof tokenContract.currentProvider.sendAsync !== "function") {
  tokenContract.currentProvider.sendAsync = function () {
    return tokenContract.currentProvider.send.apply(
      tokenContract.currentProvider, arguments
    );
  };
}

/**
 * Instantiate a contract instance to interact with the contract via erc20 methods 
 * NOTE: currently being tested for transferFrom() 
 */
const Erc20Contract = require('./erc20-contract');
const erc20Contract = new Erc20Contract(contractAddress, ownerAddress);
const tokenWeb3 = erc20Contract.token;

/**
 * Object holds all parameters and functions needed to communicate by the API
 */
Token = {
  web3Provider: web3Provider,
  contracts: {},

  web3: web3,
  network: network,
  networkToken: networkToken,
  tokenContract: tokenContract,
  contractJson: contractJson,
  accounts: web3.eth.getAccounts().then((accounts) => {
    return accounts;
  }),
  getBalance: async function (address) {
    let bal = {};
    let t = await web3.eth.getBalance(address, function (error, balance) {
      if (error) {
        return bal.error = err.message;
      }
      let balanceObj = new BigNumber(balance);
      bal.address = address;
      bal.balanceObj = balanceObj;
      bal.wei = balanceObj.toNumber();
      bal.ether = web3.utils.fromWei(balance, 'ether');
    })
    this.getTokenOwner().then((value) => {
      if (value.owner == address.toLowerCase()) {
        bal.owner = true;
      } else {
        bal.owner = false;
      }
    }).catch(function (err) {
      console.log(err.message);
      return bal.error = err.message;
    });
    let t2 = await tokenContract.at(contractAddress).then(function (instance) {
      tokenInstance = instance;
      let dec = tokenInstance.decimals().then((value) => {
        bal.tokenDecimals = value;
      });
      return tokenInstance.balanceOf(address);
    }).then(function (result) {
      // bal.tokenBalance = result.toFixed(bal.tokenDecimals);
      bal.tokenBalance = result;
    }).catch(function (err) {
      console.log(err.message);
      return bal.error = err.message;
    });
    return bal;
  },
  getTokenInfo: async function () {
    //info for token when created, owner, amount, supply
    let obj = {};
    await this.getTokenOwner().then((value) => {
      obj.owner = value.owner;
      obj.contractAddress = contractAddress;
      let t = tokenContract.at(contractAddress).then(function (instance) {
        tokenInstance = instance;

        infoArray = [
          tokenInstance.name(),
          tokenInstance.symbol(),
          tokenInstance.decimals(),
          tokenInstance.totalSupply(),
          tokenInstance.balanceOf(value.owner)
        ]
        return Promise.all(infoArray).then((values) => {
          obj.tokenName = values[0];
          obj.tokenSymbol = values[1];
          obj.tokenDecimals = values[2];
          obj.totalSupply = values[3];
          obj.tokenBalance = values[4];
          return obj;
        })
        //initial variable but changed by addTokenToTotalSupply()
        // tokenInstance.INITIAL_SUPPLY().then((value) => {
        //   obj.tokenInitialSupply = value;
        // });
      }).then(function (result) {
        return result;
      }).catch(function (err) {
        console.log(err.message);
        return obj.error = err.message;
      });
      return t;
    }).catch(function (err) {
      console.log(err.message);
      return obj.error = err.message;
    });;
    return obj;
  },
  getTokenOwner: async function () {
    let obj = {};
    let t = await tokenContract.at(contractAddress).then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.owner.call();
    }).then(function (result) {
      obj.owner = result;
      return obj;
    }).catch(function (err) {
      console.log(err.message);
      return obj.error = err.message;
    });
    return t;
  },
  addTokenToTotalSupply: async function (amount) {
    let obj = {};
    await this.getTokenOwner().then((value) => {
      let t = tokenContract.at(contractAddress).then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.addTokenToTotalSupply(amount, { from: value.owner });
      }).then(function (result) {
        obj.amount = amount
        obj.transaction = result;
        return obj;
      }).catch(function (err) {
        console.log(err.message);
        return obj.error = err.message;
      });
      return t;
    }).catch(function (err) {
      console.log(err.message);
      return obj.error = err.message;
    });
    return obj;
  },
  transferTokens: async function (toAddress, amount) {
    let obj = {};
    await this.getTokenOwner().then((value) => {
      let t = tokenContract.at(contractAddress).then(function (instance) {
        tokenInstance = instance;
        obj.ownerAdress = value.owner;
        return tokenInstance.transfer(toAddress, amount, { from: value.owner });
      }).then(function (result) {
        obj.toAddress = toAddress;
        obj.transaction = result;
        obj.amount = amount;
        return obj;
      }).catch(function (err) {
        console.log(err.message);
        return obj.error = err.message;
      });
      return t;
    }).catch(function (err) {
      console.log(err.message);
      return obj.error = err.message;
    });
    return obj;
  },
  /**
   * Transfer tokens between addresses
   * approve() - is required to authorize from address to withdraw tokens from owner address
   * @param {Object} object contains the from, to, value parameters needed for transfering tokens
   * @return {(Promise|Object)}
   */
  transferFrom: async function (body) {
    console.log('token body: ', body)
    let obj = {};
    // obj.test = tokenWeb3.methods.owner().call().then((val) => {
    // return tokenWeb3.methods.owner().call().then((val) => {
    // return tokenWeb3.methods.allowance("0x83634a8eaadc34b860b4553e0daf1fac1cb43b1e", "0x07ce1f5852f222cc261ca803a1da4a4016154539").send({ from: ownerAddress })
    //   .then((val) => {
    //     obj.allowance = val;
    //     return obj;
    //   }).catch(function (err) {
    //     console.log('err', err.message);
    //     obj.error = err.message;
    //     return obj;
    //   });;
    // return obj;

    // test transferFrom() with .then() --fails with out of gas error
    // return tokenWeb3.methods.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", 002).send({ from: ownerAddress, gas: 44000 })
    //   .then((val) => {
    //     obj.gas = val;
    //     return obj;
    //   }).catch(function (err) {
    //     console.log('err', err.message);
    //     obj.error = err.message;
    //     return obj;
    //   });;

      // Tested estimatedGas() workes except for transferFrom() unless the value is set to 0??
      // return tokenWeb3.methods.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", 001).estimateGas({from:ownerAddress, gas: 43970})
    // return tokenWeb3.methods.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", 001).estimateGas()
    return tokenWeb3.methods.approve("0x07ce1f5852f222cc261ca803a1da4a4016154539", 002).estimateGas({ gas: 5000000 })
      // return tokenWeb3.methods.allowance("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a").estimateGas({ gas: 5000000 })
      .then((val) => {
        obj.gas = val;
        return obj;
      }).catch(function (err) {
        console.log('err', err.message);
        obj.error = err.message;
        return obj;
      });;


    // testing transferFrom with events --same error with out of gas
    // return tokenWeb3.methods.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", 002).send({ from: ownerAddress })
    // return tokenWeb3.methods.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", 002).send({ from: ownerAddress, gas: 200000 })
    //   .on('transactionHash', (hash) => {
    //     console.log('transactionHash', hash);
    //     obj.hash = hash;
    //     return obj;
    //   })
    //   // .on('error', (error, receipt) => {
    //   //   obj.error = error;
    //   //   obj.errorReceipt = receipt;
    //   //   return obj;
    //   // })
    //   .catch(function (err) {
    //     console.log('err', err.message);
    //     obj.error = err.message;
    //     return obj;
    //   });;

    // tested transferFrom with callback --same error with out of gas
    // return tokenWeb3.methods.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", 002).send({from: ownerAddress}, function(error, transactionHash){
    //   if (!error) {
    //     console.log('transactionHash', transactionHash);
    //     obj.hash = transactionHash;
    //     return obj;
    //   } else {
    //     console.log('error', error);
    //     obj.error = error;
    //     return obj;
    //   }
    // });


    /**
     * Using truffle contract instance 
     */
    // let t = await tokenContract.at(contractAddress).then(function (instance) {
    //   tokenInstance = instance;
    //   // return tokenInstance.owner.call();
    //   const sender = "0x07ce1f5852f222cc261ca803a1da4a4016154539";

    //   // let array = [
    //   //   obj.approved = tokenInstance.approve("0x07ce1f5852f222cc261ca803a1da4a4016154539", 001).then((approve) => {
    //   //     console.log('approve confirmation: ', approve);
    //   //     obj.transferFrom = tokenInstance.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", 001).then((transfer) => {
    //   //       console.log('transfer confirmation: ', transfer);
    //   //       return;
    //   //     });
    //   //   }),
    //   // ]

    //   // return Promise.all(array).then((values) => {
    //   //   console.log('values', values)
    //   //   obj.transferred = values;
    //   //   return obj;
    //   // })

    let value = 002;

    /**
     * Actual methods to perform once "out of gas" issue in transferFrom() is resolved
     */
    // // return tokenInstance.approve("0x3E672122Bfd3D6548Ee1CC4F1Fa111174E8465fB", 001).then((approve) => {
    // // return tokenInstance.approve("0x07ce1f5852f222cc261ca803a1da4a4016154539", value, { from: ownerAddress })
    // return tokenWeb3.methods.approve("0x07ce1f5852f222cc261ca803a1da4a4016154539", value).send({ from: ownerAddress })
    //   // .then((approve) => {
    //   .on('transactionHash', (approveHash) => {
    //     console.log('approve confirmation: ', approveHash);
    //     obj.approve = approveHash;
    //     obj.transferFromProcessing = "Processing...check your addresses for the transfer transaction in a few minutes";
    //     // return obj
    //     // return tutorialTokenInstance.transferFrom("0x3E672122Bfd3D6548Ee1CC4F1Fa111174E8465fB","0x5c0c21da54a9f692900e7983d0c3e854b40e914a",100).then((transfer) => {
    //     // obj.transferFrom = tokenInstance.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", value).send({ from: ownerAddress })
    //     // tokenInstance.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", value).send({ from: ownerAddress })
    //     return tokenWeb3.methods.transferFrom("0x07ce1f5852f222cc261ca803a1da4a4016154539", "0x5c0c21da54a9f692900e7983d0c3e854b40e914a", value).send({ from: ownerAddress })
    //       // .then((transfer) => {
    //       //   console.log('transfer confirmation: ', transfer);
    //       //   // return obj;
    //       // })
    //       .on('transactionHash', (hash) => {
    //         console.log('transactionHash', hash);
    //         obj.hash = hash;
    //         return obj;
    //       })
    //       .on('error', (error, receipt) => {
    //         obj.error = error;
    //         obj.errorReceipt = receipt;
    //         return obj;
    //       })
    //       .catch(function (err) {
    //         console.log('errtx', err.message);
    //         obj.error = err.message;
    //         return obj;
    //       })
    //     // return obj;
    //   })
    //   .on('error', (error, receipt) => {
    //     obj.error = error;
    //     obj.errorReceipt = receipt;
    //     return obj;
    //   })
    //   .catch(function (err) {
    //     console.log('errt', err.message);
    //     obj.error = err.message;
    //     return obj;
    //   });

    // }).then(function (result) {
    //   obj = result;
    //   return obj;
    // }).catch(function (err) {
    //   console.log('err2', err);
    //   console.log('err', err.message);
    //   obj.error = err.message;
    //   return obj;
    // });
    // return t;
  },
  transferOwnership: async function (toAddress) {
    /**
     * BUG::Seems to return invalid address tokenInstance.transferOwnership
     * could be Ownable.sol contract from openzeppelin
     */
    let obj = {};
    await this.getTokenOwner().then((value) => {
      var t = tokenContract.at(contractAddress).then(function (instance) {
        tokenInstance = instance;
        obj.currentOwner = value.owner;
        obj.toAddress = toAddress.toLowerCase();
        return tokenInstance.transferOwnership(toAddress.toLowerCase());
      }).then(function (result) {
        obj.transaction = result;
        return obj;
      }).catch(function (err) {
        obj.transferred = false;
        console.log(err.message);
        return obj.error = err.message;
      });
      return t;
    }).catch(function (err) {
      console.log(err.message);
      return obj.error = err.message;
    });
    return obj;
  },
  killToken: async function () {
    /**
     * BUG::Seems to return invalid address tokenInstance.kill
     * could be Ownable.sol contract from openzeppelin
     */
    let obj = {};
    let t = await tokenContract.at(contractAddress).then(function (instance) {
      tokenInstance = instance;
      return tokenInstance.kill();
    }).then(function (result) {
      obj.tokenKilled = result;
      return obj;
    }).catch(function (err) {
      obj.tokenKilled = false;
      obj.error = err.message;
      console.log(err.message);
      return obj;
    });
    return t;
  },
  /**
   * Send ether to token contract address from the owner address
   * IMPORTANT: works once owner address is unlocked within node but requires testing and proper integration into API
   * @param {Number} amount of ether in wei
   * @return {(Promise|Object)} transaction receipt
   */
  pay: function (amount) {
    let obj = {};
    // tested sending ether to contract; WORKES! BUT block/hash object response but not just hash;
    // return tokenWeb3.methods.pay().send({ from: ownerAddress, value: 1000000000000000 })
    return tokenWeb3.methods.pay().send({ from: ownerAddress, value: amount })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
        obj.hash = hash;
        return obj;
      })
      .on('error', (error, receipt) => {
        console.log('error', error);
        console.log('receipt', receipt);
        obj.error = error;
        obj.errorReceipt = receipt;
        return obj;
      })
      .catch(function (err) {
        console.log('err', err.message);
        obj.error = err.message;
        return obj;
      });;
  }
}

module.exports = Token;