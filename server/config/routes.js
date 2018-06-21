// List all endpoints
const listEndpoints = require('express-list-endpoints');
// require routes
var uiRouter = require('../app/routes/index');
var apiRouter = require('../app/routes/api');
var apiTokenRouter = require('../app/routes/api-token');
var apiEthereumRouter = require('../app/routes/api-ethereum');




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

}
