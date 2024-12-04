#!/usr/bin/yarn dev

const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const listProducts = require('./products'); // Import product data

const app = express();
const port = 1245;

// Create a Redis client
const client = redis.createClient();
client.on("error", function (error) {
  console.error(error);
});

// Promisify Redis methods
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

// Function to get item by ID
const getItemById = (id) => {
  return listProducts.find(product => product.id === id);
};

// Route: Get all products
app.get('/list_products', (req, res) => {
  const products = listProducts.map(product => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
  }));
  res.json(products);
});

// Route: Get product by ID with current reserved stock
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  // Get current reserved stock from Redis
  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = product.stock - reservedStock;

  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: currentQuantity
  });
});

// Function to reserve stock in Redis
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Function to get the current reserved stock for an item
const getCurrentReservedStockById = async (itemId) => {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock ? parseInt(reservedStock, 10) : 0;
};

// Route: Reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  // Get current reserved stock
  const reservedStock = await getCurrentReservedStockById(itemId);
  const availableStock = product.stock - reservedStock;

  if (availableStock <= 0) {
    return res.json({
      status: "Not enough stock available",
      itemId: itemId
    });
  }

  // Reserve one item
  await reserveStockById(itemId, reservedStock + 1);
  res.json({
    status: "Reservation confirmed",
    itemId: itemId
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
