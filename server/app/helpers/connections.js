const connections = require('../../../config/connections.json');
const networkType = connections.networks.connectApi;
const network = connections.networks[networkType]
const networkUrl = network.url;
const websocketUrl = network.websocketUrl;
const networkToken = network.token;
const blockWebhookUrl = network.blockWebhookUrl;
const syncingWebhookUrl = network.syncingWebhookUrl;
const testWebhookUrl = network.testWebhookUrl;

Connections = {
  connections: connections,
  networkType: networkType,
  network: network,
  networkUrl: networkUrl,
  websocketUrl: websocketUrl,
  networkToken: networkToken,
  blockWebhookUrl: blockWebhookUrl,
  syncingWebhookUrl: syncingWebhookUrl,
  testWebhookUrl: testWebhookUrl
}

module.exports = Connections;