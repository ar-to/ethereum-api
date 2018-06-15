const TokenHelpers = require('./TokenHelpers');

// class Controller extends TokenHelpers {
class Controller {
  constructor(contractAddress,ownerAddress) {
    this.ownerAddress = ownerAddress;
    this.tokenHelpers = new TokenHelpers(contractAddress,ownerAddress)
    this.tokenContract = this.tokenHelpers.erc20Contract.token;
    this.tokenWeb3 = this.tokenHelpers.tokenWeb3
    // super(contractAddress)

    this.getTest = (req, res, next) => {
      // return res.send("Token API!!!!")
      // console.log('help>>>', this.tokenHelpers.getTokenOwner)
      // console.log('help>>>', super.getTokenOwner)
      // super.erc20Contract.token.methods.owner().call()
      // this.tokenHelpers.erc20Contract.token.methods.owner().call()
      // this.tokenContract.methods.owner().call()//contract instance works
      // this.tokenHelpers.tokenWeb3.methods.owner().call()//contract instance from parent class using the static method
      // this.tokenWeb3.methods.owner().call()//contract instance from parent class using the static method
      // this.tokenHelpers.getTokenOwner()//constructor method works
      this.tokenHelpers.getTest()//regular class method works
      .then((value) => {
        return res.send(value);
      }).catch((err) => {
        return err;
      })
    }

    this.getTokenOwner = (req, res, next) => {
      let obj = new Object();
      return this.tokenHelpers.erc20Contract.token.methods.owner().call()
      .then((value) => {
        obj.tokenOwner = value;
        // return res.send(value);
        return res.send(obj);
      }).catch((err) => {
        return err;
      })
    }

    this.getNodeAccounts = (req, res, next) => {
      return this.tokenHelpers.accounts()
      .then((value) => {
        res.send(value);
      });
    }

    this.checkForContract = (req, res, next) => {
      let obj = new Object();
      return this.tokenHelpers.checkForContract(req.params.address).then((value) => {
        if (value == '0x') {
          obj.isContract = false;
        } else {
          obj.isContract = true;
        }
        obj.result = value;
        return res.send(obj);
      });
    }

    this.getAddressBalance = (req, res, next) => {
      let obj = new Object();
      // let owner = token.networkToken.ownerAddress;
      console.log('token ownerAddres:', this.ownerAddress)
      return this.tokenHelpers.getBalance(this.ownerAddress)
      // console.log('token methods:', this.tokenHelpers.erc20Contract.token.methods)
      // this.tokenHelpers.erc20Contract.token.methods.balanceOf("0x83634a8eaadc34b860b4553e0daf1fac1cb43b1e")
      // this.tokenHelpers.erc20Contract.token.methods.balanceOf("0x83634a8eaadc34b860b4553e0daf1fac1cb43b1e").call()
      // this.tokenHelpers.erc20Contract.token.methods.balanceOf(this.ownerAddress)
      // this.tokenHelpers.erc20Contract.token.methods.owner().call()
      .then((balance) => {
        console.log('bal: ',balance)
        obj.tokenBalance = balance
        return res.send(obj)
      })
      .catch((err) => {
        console.log('err: ',err)
        // return err;
        obj.error = err;
        return res.send(obj)
      })
    //   if (req.params) {
    //     let address = "";
    //     address = req.params.address != null && token.web3.utils.isAddress(req.params.address) ? req.params.address : false;
    //     if (address === false) {
    //       res.status(404).end();
    //     } else {
    //       await this.tokenHelpers.getBalance(address).then((value) => {
    //         return res.send(value)
    //       });
    //     }
    //   } else {
    //     res.status(404).end();
    //   }
    }
  }

}

module.exports = Controller;