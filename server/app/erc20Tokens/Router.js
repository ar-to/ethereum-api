// var tokenApi = require('../controllers/api-token');
var express = require('express');
var router = express.Router();

var Controller = require('./Controller');

// test
// var tokenApi = require('../controllers/api-token');


class Router {
  constructor(contractAddress,ownerAddress) {
    this.contractAddress = contractAddress;
    this.controller = new Controller(contractAddress, ownerAddress);
    this.routes = this.constructor.startRoutes(this.controller);
  }
  static startRoutes(controller) {
    // router.route('/')
    // .get(controller.getTokenInfo);
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',controller.tokenWeb3)
    router.get('/', controller.getTest);
    router.get('/node-accounts', controller.getNodeAccounts);
    router.get('/check-for-contract/:address', controller.checkForContract);
    router.get('/owner', controller.getTokenOwner);
    router.get('/balance', controller.getAddressBalance);

    return router;
  }
}

module.exports = Router;