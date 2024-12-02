#!/usr/bin/yarn dev

import kue from 'kue';

// Create a queue named 'push_notification_code'
const queue = kue.createQueue();

// Define the job data object
const jobData = {
  phoneNumber: '0783721738',
  message: 'Welcome to our service!',
};

// Create a job with the name 'push_notification_code'
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.log('Error creating job:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// When the job is completed
job.on('complete', () => {
  console.log('Notification job completed');
});

// When the job fails
job.on('failed', (err) => {
  console.log('Notification job failed', err);
});
