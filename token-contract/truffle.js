var WalletProvider = require("truffle-wallet-provider");

// ROPSTEN testnet
const ropstenConfig = require("../network-wallets/ropsten.config.json");
var ropstenProvider;
if(ropstenConfig){
  const keystore = ropstenConfig.keystore;
  const pass = ropstenConfig.password;
  const url = ropstenConfig.url
  var wallet = require('ethereumjs-wallet').fromV3(keystore, pass);
  ropstenProvider = new WalletProvider(wallet, url);
}

// Mainnet
// const liveConfig = require("../network-wallets/mainnet.config.json");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      from: "0x451E62137891156215d9D58BeDdc6dE3f30218e7"
    },
    ropsten: {
      provider: ropstenProvider,
      network_id: '3',
      gas: 2249435,
      gasPrice: 20000000000,
    },
  }
};
