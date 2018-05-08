// List all endpoints
const listEndpoints = require('express-list-endpoints');
// require routes
var uiRouter = require('../app/routes/index');
var apiRouter = require('../app/routes/api');


module.exports = function (app) {
  // UI
  app.use('/', uiRouter);
  // API
  app.use('/api', apiRouter);
  // API endpoints
  app.get('/api-endpoints', function (req, res) {
    res.json(listEndpoints(app));
  });
}
