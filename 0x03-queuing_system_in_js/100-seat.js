#!/usr/bin/yarn dev

const express = require('express');
const { getCurrentAvailableSeats, reserveSeat } = require('./reservation');
const queue = require('./queue');
const { setAsync } = require('./redisClient');

const app = express();
const port = 1245;

// Initialize the application with 50 seats
async function initializeApp() {
  await setAsync('available_seats', 50);
  global.reservationEnabled = true; // Flag to track if reservations are enabled
}

initializeApp();

// Route to get the current available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!global.reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = queue.create('reserve_seat', {})
    .save((err) => {
      if (err) {
        return res.json({ status: 'Reservation failed' });
      }
      res.json({ status: 'Reservation in process' });
    });
});

// Route to process the queue and reserve seats
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  const job = queue.process('reserve_seat', async (job, done) => {
    try {
      const newSeats = await reserveSeat(1); // Reserve 1 seat for each job
      if (newSeats <= 0) {
        global.reservationEnabled = false; // Disable reservation if no seats left
        done(new Error('Not enough seats available'));
      } else {
        console.log(`Seat reservation job ${job.id} completed`);
        done();
      }
    } catch (err) {
      console.error(`Seat reservation job ${job.id} failed: ${err.message}`);
      done(err);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
