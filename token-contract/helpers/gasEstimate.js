/**
 * Taken sample from:
 * https://ethereum.stackexchange.com/questions/40155/what-should-be-the-gas-and-gasprice-for-ropsten-network-in-truffle-config
 * https://github.com/gjeanmart/stackexchange/blob/master/11053-how-to-estimate-gas-at-contract-creation-deployment-to-private-ethereum-blockcha/estimate_deployment.js
 */

var Token = artifacts.require("./Token.sol");

module.exports = function (callback) {

  // blockchain.web3.eth.getGasPrice(function (error, result) {
    Token.web3.eth.getGasPrice(function (error, result) {
    var gasPrice = Number(result);
    console.log("Gas Price is " + gasPrice + " wei"); // "10000000000000"

    var TokenContract = web3.eth.contract(Token._json.abi);
    // var TokenContract = blockchain.web3.eth.contract(Token._json.abi);
    var contractData = TokenContract.new.getData({ data: Token._json.bytecode });
    var gas = Number(web3.eth.estimateGas({ data: contractData }))
    // var gas = Number(blockchain.web3.eth.estimateGas({ data: contractData }))


    console.log("Gas Price is = " + web3.fromWei(gasPrice, 'gwei') + " gwei");
    console.log("gas estimation = " + gas + " units");
    console.log("gas cost estimation = " + (gas * gasPrice) + " wei");
    console.log("gas cost estimation = " + Token.web3.fromWei((gas * gasPrice), 'ether') + " ether");

    process.exit()
  });
};