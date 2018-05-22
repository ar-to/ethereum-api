const connections = require('../../../config/connections.json');
const networkType = connections.networks.connectApi;
const network = connections.networks[networkType]
const blockWebhookUrl = connections.networks[networkType].blockWebhookUrl;
const syncingWebhookUrl = connections.networks[networkType].syncingWebhookUrl;
const testWebhookUrl = connections.networks[networkType].testWebhookUrl;

/**
 * Object holds all parameters and functions needed to communicate by the API
 */
WebhookObject = {
  network: network,
  blockWebhookUrl: blockWebhookUrl ? blockWebhookUrl : null,
  syncingWebhookUrl: syncingWebhookUrl ? syncingWebhookUrl : null,
  testWebhookUrl: testWebhookUrl ? testWebhookUrl : null,
}

module.exports = WebhookObject;