# Threshodl Token

## Getting Started

NOTE: the contracts are compiled into the `token-contract/build/contracts` directory and it was added to `/gitignore` as a **comment** to facilitate migrating new contracts during development when using a local private node. But when coming back to the default contract simple compile and migrate or migrate with reset to overwrite existing contracts.

### Run Private Test Node

The easiest method to run a local private ethereum node that will also mine blocks to facilitate creating transactions and to tests this api is via [Ganache](http://truffleframework.com/ganache/) GUI application. 

```
brew cask install ganache
```
Open application and it will automatically create 10 addresses. Save the mnemonic phrase if you want to use it again. It will be set the url to `http://127.0.0.1:7545`

### Environment Variables

Create `.env` file in the root directory and add the following:

```
# migration address is here for reference and used by truffle
MIGRATE_ADDRESS=taken-from-migration-output

## Required for API
NODE_URL=taken-from-node-url

# token contract address required for instantiating contract to use its functions
TOKEN_CONTRACT_ADDRESS=taken-from-node-address

# owner address required when /api/balance
OWNER_ACCOUNT=taken-from-migration-output
```

### Truffle Token Contract

This requires familiarization with truffle framework and open-zeppelin for making ERC20 token contracts.

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

## Sample Contracts

Sample constracts are used for reference and can be found in `token-contract/samples`. 

- advancedToken.sol - sample token code that has been fixed to meet solidity v0.4.23. This can be tested by adding it into Mist app. Deploy using TokenERC20 token name.


## Bugs to Fix

transferOwnership & kill functions both catch an 'invalid address'. The response it 200 with `false` boolean indicating request failed. 