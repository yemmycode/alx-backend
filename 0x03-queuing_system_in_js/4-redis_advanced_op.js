#!/usr/bin/yarn dev

/**
 * This script demonstrates storing and retrieving hash values in Redis.
 */

// Import necessary modules
import { createClient, print } from 'redis';

// Create a Redis client instance
const client = createClient();

// Event listener for connection success
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event listener for connection error
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

// Key for the hash
const hashKey = 'HolbertonSchools';

// Data to store in the hash
const schoolData = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

// Create the hash using hset
Object.entries(schoolData).forEach(([field, value]) => {
  client.hset(hashKey, field, value, print); // redis.print logs "Reply: 1" for each field-value pair
});

// Display the hash using hgetall
client.hgetall(hashKey, (err, result) => {
  if (err) {
    console.error('Error fetching hash:', err);
  } else {
    console.log(result);
  }
});
