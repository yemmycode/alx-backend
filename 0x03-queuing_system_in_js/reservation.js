const { getAsync, setAsync } = require('./redisClient');

// Reserve a seat by decreasing the available seats
async function reserveSeat(number) {
  const currentAvailableSeats = await getAsync('available_seats');
  const newAvailableSeats = parseInt(currentAvailableSeats) - number;
  if (newAvailableSeats < 0) {
    throw new Error('Not enough seats available');
  }
  await setAsync('available_seats', newAvailableSeats);
  return newAvailableSeats;
}

// Get current available seats
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return seats;
}

module.exports = {
  reserveSeat,
  getCurrentAvailableSeats,
};
