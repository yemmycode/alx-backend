#!/usr/bin/yarn dev

/**
 * This script demonstrates basic Redis operations:
 * - Setting and getting key-value pairs using callbacks.
 * - Displays confirmation and retrieved values in the console.
 */

// Import the Redis library
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

/**
 * Sets a value for the provided key in Redis.
 * @param {string} schoolName - The key to set in Redis.
 * @param {string} value - The value to set for the key.
 */
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print); // redis.print displays "Reply: OK" on success
}

/**
 * Retrieves and logs the value for the provided key in Redis.
 * @param {string} schoolName - The key to retrieve from Redis.
 */
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, value) => {
    if (err) {
      console.error('Error retrieving value:', err);
    } else {
      console.log(value);
    }
  });
}

// Perform operations
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

