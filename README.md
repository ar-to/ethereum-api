# Threshodl Token

## Table of Contents

- [Quick Start](#quick-start)
- Getting Started
  - [Run Private Test Node](#run-private-test-node)
  - [Config](#config)
  - [Environment Variables](#environment-variablese)
  - [Truffle Token Contract](#truffle-token-contract)
  - [Development local node](#development-local-node)
  - [Testnet node](#testnet-node)
  - [Run truffle commands](#run-truffle-commands)
  - [Server](#server)
  - [Adding Networks](#adding-networks)
- [Notes](#notes)
- [Scripts](#scripts)
- [Bash](#bash)
- [Helpers](#helpers)
- [Keystore](#keystore)
- [Error Debugging](#error-debugging)
- [Sample Contracts](#sample-contracts)
- [Version Control]($version-control)
- [Endpoint Notes](#endpoint-notes)
  - [Get Block Info](#get-block-info)
  - [Get Transaction Info](#get-transaction-info)
  - [Send Transaction](#send-transaction)
- [List of All API Endpoints](#endpoints)

## Quick Start

Install [Ganache](http://truffleframework.com/ganache/) to have a local blockchain and start it. You will see 10 address and a mnemonic phrase. Copy `RPC Server` URL, e.g `HTTP://127.0.0.1:7545`

```
brew cask install ganache
```

Create `.env` in root

```
NODE_URL=http://127.0.0.1:7545
```

Clone repo and start server

```
git clone git@github.com:ar-to/ethereum-api.git
cd ethereum-api
npm install
npm start
```
in new terminal check if connected and what accounts you have on the node
```
curl http://localhost:3000/api/eth/syncing
{"nodeSynced":true}
http://localhost:3000/api/eth/accounts
{"accounts":["0xAb7faf7bDAE1B9D0F757e2a8aB120619b388C4c6","0x451E62137891156215d9D58BeDdc6dE3f30218e7","0x22B55D4cc5cE3E32Ee31B0684172E2BCE9F722e7","0x71c9625B0005F20d264775cfF8fc9FB1BEf96525","0x48E5A9807A1C862CeB00a9867c1b57dF02b8F1Fe","0xb7B3FaD7d81C5D2e09Dc464Fec36AC6b4e1B04d3","0x16e665134A1A3b048b2d9aFdB612Bd34CAc0F35C","0xcCFf4FEa69126b9E2c7ce02d69d7c5205657e722","0x032D0Fa0AD21aa5a50C6c6e13D9d14a9550457C5","0x20032730927fB07C46e20FD3725C1f77b04cd4ee"]}
```


## Getting Started

Please read [notes](#notes) for important information before developing.


### Run Private Test Node

The easiest method to run a local private ethereum node that will also mine blocks to facilitate creating transactions and to tests this api is via [Ganache](http://truffleframework.com/ganache/) GUI application. 

```
brew cask install ganache
```
Open application and it will automatically create 10 addresses. Save the mnemonic phrase if you want to use it again. It will be set the url to `http://127.0.0.1:7545`

### Config
Add connections to `config/connections.json`, and set the name of the network you want to use for the API using `"connectApi": "network-name",`

```
{
  "networks": {
    "connectApi": "ganache",
    "ganache":{
      "url": "http://127.0.0.1:7545",
      "networkId": "5777",
      "networkName": "ganache",
      "networkType": "testrpc",
      "token": {
        "ownerAddress": "0x451E62137891156215d9D58BeDdc6dE3f30218e7",
        "tokenContractAddress": "0x4c59b696552863429d25917b52263532af6e6078",
        "migrateContractAddress": "0xcf068555df7eab0a9bad97829aa1a187bbffbdba"
      }
    },
    "ropsten":{},
    "mainnet":{}
  }
}
```

Copy the same parameters from ganache above to other networks.

### Environment Variables

You can change the port for the server and overwrite the node url from the connections.json by adding it in a `.env` file at the root directory.

```
PORT=4000
NODE_URL=http://127.0.0.1:7545
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

#### Testnet node 

(e.g. Ropsten, etc)

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

## Notes

1. This api uses web3 for interacting with the node, but manual curl commands can be used via [RPC calls](https://github.com/ethereum/wiki/wiki/JSON-RPC). Test the `bash bin/rpc-call` to test an rpc call.

2. Install a solidity extension into your choosen editor when developing contracts

3. the contracts are compiled into the `token-contract/build/contracts` directory and it was added to `/gitignore` as a **comment** to facilitate migrating new contracts during development when using a local private node. But when coming back to the default contract simple compile and migrate or migrate with reset to overwrite existing contracts. There is also a `deployed-contracts` directory that can store the artifact files (e.g.Token.json) if you want to keep different deployments to interact with your contracts in the future. Read [here](#vc) for storing contracts in version control.

## Scripts

Scripts are added for convenience to allow commands to be performs from the root and for testing.

- rpc-call - a curl command via an rpc call to communicated to a node. Remember to change the url:port to connect to the correct node and address when using the `eth_getBalance` method or pass it as an argument:
```
sh bin/rpc-call http://127.0.0.1:7545
```

- bash bin/truffle-compile

- bash bin/truffle-migrate

- bash bin/truffle-migrate-reset

- bash bin/truffle-migrate-ropsten

- bash bin/truffle-gas-estimate

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

## Error Debugging

Setting up can be somewhat complicated if not tedious. Maybe in future releases there will be much more efficient way to setup but for now fixing and understanding error is best to guarantee everything is running correctly. Below are a few warnings or error you may see and possible ways to solve them. More added as they are found. Keep in mind error do not necessarily mean bugs, but it does not mean a bug is not present. If an error turns out to be a bug file an issue and your solution. Thanks.

- `Invalid JSON RPC response: ""` - This may show as a response from testing the api endpoint the first time you are connecting to a node. It is a failure to connect by web3 provider. Solution:
    1. restart your server
    2. Check you have the correct node url inside the `.env` file
    3. Make an RPC call to the node using the `bin/rpc-call` script to test for connection. See [scripts section](#scripts) for details
    4. wait until the connection is successful and try the endpoint you got the error again
- {package} `was compiled against a different Node.js version using` - best solution is to rebuild packages by first updating npm and node and then `npm rebuild`



## Sample Contracts

Sample constracts are used for reference and can be found in `token-contract/samples`. 

- advancedToken.sol - sample token code that has been fixed to meet solidity v0.4.23. This can be tested by adding it into Mist app. Deploy using TokenERC20 token name.

## Version Control
Question about storing artifact files (e.g. Token.json) after truffle compiles contracts with abi and contract addresses for different networks. Community in gitter (chat app) recommended to add to VC but optional not to.

- [stackexchange](https://ethereum.stackexchange.com/questions/19486/storing-a-truffle-contract-interface-in-version-control) - recommendation to store outside
- [artifact-updates](https://github.com/trufflesuite/artifact-updates) - community repo for updating some issues with doing this.

## Bugs to Fix

transferOwnership & kill functions both catch an 'invalid address'. The response it 200 with `false` boolean indicating request failed. 

`api/eth/tx-from-block/hashStringOrNumber` endpoint seems to fail when connected to Ropsten Testnet but not with ganache local node


## Endpoint Notes

The ethereum endpoint for this API uses the [web3js](http://web3js.readthedocs.io/en/1.0/) so parameters for a web3 method is normally supported by the endpoint unless otherwise specified. 

### Get Block Info

The following endpoints can be used to get information about blocks and even transactions.

- `/api/eth/tx:txHash` : get transaction details by the transaction hash
- `api/eth/tx-from-block/hashStringOrNumber` : hashStringOrNumber can be same as in the [web3 docs](http://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionfromblock), e.g. `/latest` or `0xa343d89bb0447c8a22c8ce73bf35504d9363e234b2a1a8229d40b69ce3439fc5`. See [bug](#bugs-to-fix) for problem when using it in Ropsten

- `api/eth/block/2?showTx=true&useString=latest` : 1 is the blocknumber, the query `showTx` will show the transaction object in the output when set to true, and the query `useString` will overwrite the block number and use one of the strings used in the [getBlock api](http://web3js.readthedocs.io/en/1.0/web3-eth.html#getblock) such as `latest` to get the most recent block.

### Get Transaction info


You can get information about the transaction you want to send before sending it. Information like gas, gas price, amount in wei and ether, etc.

send a POST request with transaction object below to the `api/eth/send-tx-info` endpoint
```
{
  "from": "0x451E62137891156215d9D58BeDdc6dE3f30218e7",
  "to": "0xAb7faf7bDAE1B9D0F757e2a8aB120619b388C4c6",
  "value": "0.1",
  "gas":"41000",
  "gasPrice": "high"
}
```
output
```
{
    "amountToSendEther": "0.1",
    "amountToSendWei": "100000000000000000",
    "gasPrices": {
        "low": 7,
        "medium": 9,
        "high": 14
    },
    "gasPriceTypeDefault": "low",
    "gasPriceDefault": 7000000000,
    "gasPriceTypeCustom": "high",
    "gasPrice": 14000000000,
    "estimatedGas": 21000,
    "gas": "41000",
    "params": {
        "from": "0x451e62137891156215d9d58beddc6de3f30218e7",
        "to": "0xab7faf7bdae1b9d0f757e2a8ab120619b388c4c6",
        "gasPrice": "0x342770c00",
        "value": "0x16345785d8a0000"
    },
    "paramsUpdated": {
        "from": "0x451E62137891156215d9D58BeDdc6dE3f30218e7",
        "to": "0xAb7faf7bDAE1B9D0F757e2a8aB120619b388C4c6",
        "gas": "41000",
        "gasPrice": 14000000000,
        "value": "100000000000000000"
    }
}
```

You can change the following:

- from - takes a valid ethereum address
- to - takes a valid ethereum address
- value - takes a string number in ether
- gas - you can send it without gas to see the estimatedGas and then modify it from there
- gasPrice - ["low", "medium", "high"] are the options and you can see that in the gasPrice{} object that is outputted. So if you don't pass `"gasPrice": "high"` from the above example the transaction will return `gasPriceDefault` value.

The rest of the parameters are for your information:

- gasPrices{} - taken from `https://ethgasstation.info/json/ethgasAPI.json`
- gasPriceTypeDefault - default gas using `gasPrices.low * 1000000000;`
- estimatedGas - taken from `web3.eth.estimateGas(txObject)`, where `txObject` is created from the other parameters and is shown as `params`
- params - transaction object that is used to calculate the estimated gas
- paramsUpdated - is the final transaction object that will be used for sending the transaction

Note: you may notice that `nonce` is not a parameter accepted for changing because it is optional for the `sendTransaction()` function. If required it needs to be updated in the api to accept it as a parameter.

### Send Transaction

Sending a transaction uses the `paramsUpdated` object and passes it to `web3.eth.sendTransaction(paramsUpdated)`

output 

```
{
    "transactionHash": "0x7c948c9d17c80ae0e89074eddab614c2ce24d6185b21f9aa2d9fb03d393d3dec",
    "transactionIndex": 0,
    "blockHash": "0x5ea250d8c2a1e4e9cead27a457f79cce084a494f9f3009e9f806d7a81030296d",
    "blockNumber": 12,
    "gasUsed": 21000,
    "cumulativeGasUsed": 21000,
    "contractAddress": null,
    "logs": [],
    "status": true,
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
}
```

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
        "path": "/api/network",
        "methods": [
            "GET"
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
        "path": "/api/eth/syncing",
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
        "path": "/api/eth/block/:blockNumber",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/eth/tx/:transactionHash",
        "methods": [
            "GET"
        ]
    },
    {
        "path": "/api/eth/tx-from-block/:hashStringOrNumber",
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
        "path": "/api/eth/send-tx-info",
        "methods": [
            "POST"
        ]
    },
    {
        "path": "/api/eth/send-tx",
        "methods": [
            "POST"
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