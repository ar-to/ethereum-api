var Router = require('./Router');

/**
 * Unused
 */

function RouterWrapper(contractAddress,ownerAddress) {
  if (typeof contractAddress !== "undefined") {
    // console.log('RouterWrapper contractAddress:',contractAddress)
    // console.log('RouterWrapper contractAddress good!')
    this.router = new Router(contractAddress,ownerAddress)
    this.routes = this.router.routes;
  }
}

RouterWrapper.prototype.test = () => {
  return console.log('yep');
}

module.exports = RouterWrapper;