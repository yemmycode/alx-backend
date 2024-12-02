#!/usr/bin/yarn dev

import kue from 'kue';

// Create a queue to process jobs
const queue = kue.createQueue();

// Function to simulate sending a notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs from the queue
queue.process('push_notification_code', (job, done) => {
  // Extract phone number and message from the job data
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function
  sendNotification(phoneNumber, message);

  // Mark the job as done
  done();
});
