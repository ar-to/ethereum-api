// List all endpoints
const listEndpoints = require('express-list-endpoints');
// require routes
var uiRouter = require('../app/routes/index');
var apiRouter = require('../app/routes/api');
var apiTokenRouter = require('../app/routes/api-token');
var apiEthereumRouter = require('../app/routes/api-ethereum');

/**
 * Instantiate a new Router class and pass the contract address for a token
 * instantiate new Routers with new contract addresses
 */
var Router = require('../app/erc20Tokens/Router');
const contractAddress1 = "0x3e672122bfd3d6548ee1cc4f1fa111174e8465fb";//THDL --change to golem
const ownerAddress = "0x83634a8eaadc34b860b4553e0daf1fac1cb43b1e";
const golemTokenRouter = new Router(contractAddress1,ownerAddress);
const golemRoutes = golemTokenRouter.routes;

const contractAddress2 = "0x583cbBb8a8443B38aBcC0c956beCe47340ea1367";//Bokky --change to golem
const ownerAddress2 = "0x83634a8eaadc34b860b4553e0daf1fac1cb43b1e";
const golemTokenRouter2 = new Router(contractAddress2,ownerAddress2);
const golemRoutes2 = golemTokenRouter2.routes;


module.exports = function (app) {
  // UI
  app.use('/', uiRouter);
  // API token
  app.use('/api', apiRouter);
  // API Token
  app.use('/api/token', apiTokenRouter);
  // API Ethereum
  app.use('/api/eth', apiEthereumRouter);
  // API endpoints
  app.get('/api-endpoints', function (req, res) {
    res.json(listEndpoints(app));
  });

  // API Tokens
  app.use('/api/token/threshodl', golemRoutes);
  app.use('/api/token/bokky', golemRoutes2);
}
