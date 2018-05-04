// require routes
var uiRouter = require('../app/routes/index');
var apiRouter = require('../app/routes/api');


module.exports = function (app) {
    // UI
    app.use('/', uiRouter);
    // API
    app.use('/api', apiRouter);
}
