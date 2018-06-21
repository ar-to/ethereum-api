// var tokenApi = require('../controllers/api-token');
var express = require('express');
var router = express.Router();

var Controller = require('./Controller');

// test
// var tokenApi = require('../controllers/api-token');


function Router(){
  return init().then(ok =>{
     return  syncServers();
  });
}

const init = () => {
  return new Promise((resolve,reject) =>{
    router.get('/', controller.getTest);
    router.get('/node-accounts', controller.getNodeAccounts);
    router.get('/check-for-contract/:address', controller.checkForContract);
    router.get('/owner', controller.getTokenOwner);
    router.get('/balance/:address', controller.getAddressBalance);
    return resolve(true);
  })
}

module.exports = Router;