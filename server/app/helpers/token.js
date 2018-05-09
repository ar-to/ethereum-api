const Web3 = require('web3');
var BigNumber = require('bignumber.js');//handles web3 balances
const TruffleContract = require("truffle-contract");
const contractJson = require("../../../token-contract/build/contracts/Token.json");

var web3Provider;
var web3;//instance
var tokenArtifact;//json with ABI data
var tokenContract;//instance
var tokenInstance;//actual instance of token contract that allows access to contract functions
const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS;

// Initialize web3 and set the provider to the testRPC.
web3Provider = new Web3.providers.HttpProvider(process.env.NODE_URL);
web3 = new Web3(web3Provider);

/**
 * Get Contract instance
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
 * Object holds all parameters and functions needed to communicate by the API
 */
Token = {
  web3Provider: web3Provider,
  contracts: {},

  web3: web3,
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
          tokenInstance.totalSupply()
        ]
        Promise.all(infoArray).then((values) => {
          obj.tokenName = values[0];
          obj.tokenSymbol = values[1];
          obj.tokenDecimals = values[2];
          obj.tokenInitialSupply = values[3];
        })
        //initial variable but changed by addTokenToTotalSupply()
        // tokenInstance.INITIAL_SUPPLY().then((value) => {
        //   obj.tokenInitialSupply = value;
        // });
        return tokenInstance.balanceOf(value.owner);
      }).then(function (result) {
        // obj.tokenBalance = result.toFixed(obj.tokenDecimals);
        obj.tokenBalance = result;
        return obj;
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
}

module.exports = Token;