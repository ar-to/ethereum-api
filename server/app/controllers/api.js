const web3 = require('../helpers/web3.js');
const ethereum = require('../helpers/ethereum.js');
const token = require('../helpers/token.js');

module.exports = {
  getTest: function (req, res, next) {
    res.send("API")
  },
  postTest: function (req, res, next) {
    res.send(req.body);
  },
}