
module.exports = {
  test: function(req, res, next) {
    res.send("Hello World")
  },
  getOwner: function(req, res, next) {
    // res.send(req.body);
    res.send("Hello Worldsss")
  },
  addTokenToTotalSupply: function(req, res, next) {
    res.send(req.body);
    // res.send("Hello Worldsss")
  }
}