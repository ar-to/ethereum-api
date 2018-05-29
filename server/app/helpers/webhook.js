const connections = require('../helpers/connections.js');
const network = connections.network;
const blockWebhookUrl = connections.blockWebhookUrl;
const syncingWebhookUrl = connections.syncingWebhookUrl;
const testWebhookUrl = connections.testWebhookUrl;

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