#!/usr/bin/yarn dev

/**
 * This script publishes messages to a Redis channel.
 * It waits for a specified time before sending each message.
 */

import { createClient } from 'redis';

// Create a Redis client instance
const client = createClient();

// Event listener for connection success
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection error
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Function to publish a message to the Redis channel after a specified time
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message);
  }, time);
}

// Publish messages at different times
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300); // This will stop the subscriber
publishMessage("Holberton Student #3 starts course", 400);
