# Threshodl Token

## Getting Started

### Run Private Test Node

The easiest method to run a local private ethereum node that will also mine blocks to facilitate creating transactions and to tests this api is via [Ganache](http://truffleframework.com/ganache/) GUI application. 

```
brew cask install ganache
```
Open application and it will automatically create 10 addresses. Save the mnemonic phrase if you want to use it again. It will be set the url to `http://127.0.0.1:7545`

### Truffle Token Contract

This requires familiarization with truffle framework and open-zeppelin for making ERC20 token contracts.

Run Compile when changes are made to the `token-contract/contracts` directory.
```
bash bin/truffle-compile
```

Run Migrate to deploy contract to node. Truffle will migrate new deployments inside `token-contract/migrations` directory but ignore those already sent.

```
bash bin/truffle-migrate
```

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