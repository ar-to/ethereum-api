# Threshodl Token

- [List of All API Endpoints](#endpoints)

## Getting Started

NOTE: the contracts are compiled into the `token-contract/build/contracts` directory and it was added to `/gitignore` as a **comment** to facilitate migrating new contracts during development when using a local private node. But when coming back to the default contract simple compile and migrate or migrate with reset to overwrite existing contracts. There is also a `deployed-contracts` directory that can store the artifact files (e.g.Token.json) if you want to keep different deployments to interact with your contracts in the future. Read [here](#vc) for storing contracts in version control.

### Run Private Test Node

The easiest method to run a local private ethereum node that will also mine blocks to facilitate creating transactions and to tests this api is via [Ganache](http://truffleframework.com/ganache/) GUI application. 

```
brew cask install ganache
```
Open application and it will automatically create 10 addresses. Save the mnemonic phrase if you want to use it again. It will be set the url to `http://127.0.0.1:7545`

### Environment Variables

Create `.env` file in the root directory and add the following:

```
#
# Required by API
# to connect to correct node
# add NODE_URL values for different networks but have only one uncommented for use
# token contract address required for instantiating contract to use its functions
# owner address required when /api/balance
#

# Ganache GUI local Private node
#NODE_URL=http://127.0.0.1:7545
#TOKEN_CONTRACT_ADDRESS=0x4c59b696552863429d25917b52263532af6e6078
#OWNER_ACCOUNT=0x451E62137891156215d9D58BeDdc6dE3f30218e7

# Ropsten
NODE_URL=http://127.0.0.1:8545
TOKEN_CONTRACT_ADDRESS=0x3e672122bfd3d6548ee1cc4f1fa111174e8465fb
OWNER_ACCOUNT=0x83634a8eaadc34b860b4553e0daf1fac1cb43b1e

#
# Reference
# add variables below for potential use
# migration address is here for reference and used by truffle
#

GANACHE_MIGRATE_ADDRESS=0xcf068555df7eab0a9bad97829aa1a187bbffbdba
ROPSTEN_MIGRATE_ADDRESS=0xa8ebf36b0a34acf98395bc5163103efc37621052
```

Currently, the best way to change the network you want to have the API connect web3 to, is to change the `NODE_URL`. So you can have multiple values but only have one uncommented. Below the second will be used.

```
#NODE_URL=http://127.0.0.1:7545
NODE_URL=http://10.10.0.163:8545
```

**Remember to restart your server after changing environment variables. If running nodemon run `npm run nodemon` again**

### Truffle Token Contract

This requires familiarization with truffle framework and open-zeppelin for making ERC20 token contracts.

#### Development local node

First add the same OWNER_ACCOUNT address from the environment variable into the `truffle.js` file `from` parameter so the owner to the contract is set to this address when deployed.

```
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      from: "0x451E62137891156215d9D58BeDdc6dE3f30218e7"
    },
  }
```

#### Testnet node (e.g. Ropsten, etc)

See section on adding new networks

#### Run truffle commands
Run Compile when changes are made to the `token-contract/contracts` directory.
```
bash bin/truffle-compile
```

Run Migrate to deploy contract to node. Truffle will migrate new deployments inside `token-contract/migrations` directory but ignore those already sent.

```
bash bin/truffle-migrate
```

Resetting to overwrite the existing contracts can be done with:
```
bash bin/truffle-migrate-reset
```

####

**Remember to update the addresses in the `.env` file so the api will know which address to use for the token contract and owner.**

### Server

start the server
```
git clone url
cd projectname
npm install
npm start"
```
start server with custom port and in debug mode
```
npm run dev
```
To run server and watch for changes and run debugger via `--inspect`
```
npm run nodemon
```

## Bash
There are scripts that perform operations and follow this tips to create new ones.

Create a new bash or node script 
```
#!/usr/bin/env bash
#!/usr/bin/env node
```
```
chmod +x ./bin/newscript
```
Add it to package.json is optional
```
  "scripts": {
    "script": "./bin/newscript"
  }
```

## Adding Networks

Configuring testnets and mainnet is more complicated than with local nodes. You need to have a node that is connected to those blockchains and a url that is allowed to receive RPC calls. Then to connect it with this api, create a new JSON file for the network you are adding to `network-wallets/ropsten.config.json`

Then copy the following configuration and change it with the appropriate keystore and password:
```
{
  "keystore": {
    "address": "008aeeda4d805471df9b2a5b0f38a0c3bcba786b"
    "crypto" : {
      "cipher" : "aes-128-ctr",
      "cipherparams" : {
          "iv" : "83dbcc02d8ccb40e466191a123791e0e"
      },
      "ciphertext" : "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
      "kdf" : "scrypt",
      "kdfparams" : {
          "dklen" : 32,
          "n" : 262144,
          "r" : 1,
          "p" : 8,
          "salt" : "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
      },
      "mac" : "2103ac29920d71da29f15d75b4a16dbe95cfd7ff8faea1056c33131d846e3097"
    },
    "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
    "version" : 3
  },
  "password": "password",
  "url": "http://127.0.0.1:8545"
}
```
Read about what is a [keystore](#keystore)

Then inside `truffle.js` add the following to the top

```
// ROPSTEN testnet
const ropstenConfig = require("../network-wallets/ropsten.config.json");
var ropstenProvider;
if(ropstenConfig){
  const keystore = ropstenConfig.keystore;
  const pass = ropstenConfig.password;
  const url = ropstenConfig.url
  console.log('keystore', url)
  var wallet = require('ethereumjs-wallet').fromV3(keystore, pass);
  ropstenProvider = new WalletProvider(wallet, url);
}
```

still inside `truffle.js` add a new network:

```
ropsten: {
  provider: ropstenProvider,
  network_id: '3',
  gas: 2249435,
  gasPrice: 20000000000,
},
```
Grab the gas and gas price from [helpers](#helpers) directory, using the `token-contract/helpers/gasEstimate.js ` file.

Migrate/deploy with truffle. You can also add a script inside `bin/`

```
bash bin/truffle-migrate-ropsten
```

**Do same for mainnet using `network-wallets/mainnet.config.json`**

## Helpers

The `token-contract/helpers` directory has files that can help with contract,truffle or web3.

- gasEstimate.js - estimate the gas, gas price and total gas that a contract will consume. This information is needed for deploying to testnets and mainnet. 

run
```
bash bin/truffle-gas-estimate
```

output:

```
Using network 'development'.

Gas Price is 20000000000 wei
Gas Price is = 20 gwei
gas estimation = 2249435 units
gas cost estimation = 44988700000000000 wei
gas cost estimation = 0.0449887 ether
```

## Keystore

Read about what is a [keystore](https://medium.com/@julien.m./what-is-an-ethereum-keystore-file-86c8c5917b97) file and how to make one. Above keystore taken from [here](https://github.com/hashcat/hashcat/issues/1228) If using the geth client for creating your node, you can run `geth account new`, enter your password and check the `keystore/` directory for the keystore file. This directory is next to the chaindata where you are storing the blockchain data.

## Sample Contracts

Sample constracts are used for reference and can be found in `token-contract/samples`. 

- advancedToken.sol - sample token code that has been fixed to meet solidity v0.4.23. This can be tested by adding it into Mist app. Deploy using TokenERC20 token name.

## VC
Question about storing artifact files (e.g. Token.json) after truffle compiles contracts with abi and contract addresses for different networks. Community in gitter (chat app) recommended to add to VC but optional not to.

- [stackexchange](https://ethereum.stackexchange.com/questions/19486/storing-a-truffle-contract-interface-in-version-control) - recommendation to store outside
- [artifact-updates](https://github.com/trufflesuite/artifact-updates) - community repo for updating some issues with doing this.

## Bugs to Fix

transferOwnership & kill functions both catch an 'invalid address'. The response it 200 with `false` boolean indicating request failed. 


## Endpoints

```
[
    {
        "path": "/",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api",
        "methods": [
            "GET",
            "POST"
        ]
    },
    {
        "path": "/api/token",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/get-web3-provider",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/get-contract",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/get-contract-instance",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/node-accounts",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/balance",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/balance/:address",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/owner",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/token/add-tokens/:amount",
        "methods": [
            "POST"
        ]
    },
    {
        "path": "/api/token/transfer-tokens",
        "methods": [
            "POST"
        ]
    },
    {
        "path": "/api/token/transfer-owner",
        "methods": [
            "POST"
        ]
    },
    {
        "path": "/api/token/kill-token",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/eth",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/eth/balance/:address",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/eth/block",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/eth/create-account",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/eth/accounts",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api-endpoints",
        "methods": [
            "GET"
        ]
    }
]
```