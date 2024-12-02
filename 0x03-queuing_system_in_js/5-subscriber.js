#!/usr/bin/yarn dev

/**
 * This script subscribes to a Redis channel and processes messages.
 * It logs the messages to the console and quits on the "KILL_SERVER" message.
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

// Subscribe to the channel 'holberton school channel'
client.subscribe('holberton school channel', (err, count) => {
  if (err) {
    console.log('Error subscribing to channel:', err);
  } else {
    console.log(`Subscribed to ${count} channel(s).`);
  }
});

// Listen for messages on the 'holberton school channel'
client.on('message', (channel, message) => {
  console.log(message);

  // If the message is 'KILL_SERVER', unsubscribe and quit
  if (message === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
});
