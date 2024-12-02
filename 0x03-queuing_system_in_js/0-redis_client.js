#!/usr/bin/yarn dev

/**
 * This script connects to a Redis server using the `redis` library.
 * It logs messages indicating the connection status:
 * - Success: "Redis client connected to the server"
 * - Failure: "Redis client not connected to the server: [error]"
 */

// Import the Redis library
import { createClient } from 'redis';

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

