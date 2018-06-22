const connections = require('../../../config/connections.json');
const networkType = connections.networks.connectApi;
const network = connections.networks[networkType]
const networkUrl = network.url;
const websocketUrl = network.websocketUrl;
const networkToken = network.token;
const ownerAddress = network.token.ownerAddress;
const blockWebhookUrl = network.blockWebhookUrl;
const syncingWebhookUrl = network.syncingWebhookUrl;
const testWebhookUrl = network.testWebhookUrl;
const erc20Tokens = network.erc20Tokens;

Connections = {
  connections: connections,
  networkType: networkType,
  network: network,
  networkUrl: networkUrl,
  websocketUrl: websocketUrl,
  networkToken: networkToken,
  ownerAddress: ownerAddress,
  blockWebhookUrl: blockWebhookUrl,
  syncingWebhookUrl: syncingWebhookUrl,
  testWebhookUrl: testWebhookUrl,
  erc20Tokens: erc20Tokens
}

module.exports = Connections;