#!/usr/bin/yarn dev

/**
 * This script demonstrates basic Redis operations:
 * - Setting and getting key-value pairs.
 * - Using Promises and async/await with Redis operations.
 */

// Import the necessary modules
import { createClient, print } from 'redis';
import { promisify } from 'util';

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
 * Retrieves and logs the value for the provided key in Redis using async/await.
 * @param {string} schoolName - The key to retrieve from Redis.
 */
async function displaySchoolValue(schoolName) {
  const getAsync = promisify(client.get).bind(client); // Promisify the get method
  try {
    const value = await getAsync(schoolName); // Await the result of the promise
    console.log(value);
  } catch (err) {
    console.error('Error retrieving value:', err); // Log any error that occurs
  }
}

// Perform operations
(async () => {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
})();

