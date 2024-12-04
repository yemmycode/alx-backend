const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const client = redis.createClient();

// Promisify Redis commands for async/await usage
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {
  client,
  getAsync,
  setAsync,
};
