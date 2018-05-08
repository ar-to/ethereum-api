require('dotenv').config();//allows use of enviroment variables

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      // from: "0x451E62137891156215d9D58BeDdc6dE3f30218e7"
      from: process.env.OWNER_ACCOUNT
    },
  }
};
