#!/usr/bin/yarn dev

const kue = require('kue');
const queue = kue.createQueue();

// Blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
  // Track the job's progress at 0%
  job.progress(0, 100);

  // Check if phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
    job.progress(100, 100); // Mark the job as completed with failure
    return done(error); // Fail the job and return the error
  }

  // Otherwise, proceed with the job
  job.progress(50, 100); // Track the job's progress to 50%

  // Log the message
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate sending notification (e.g., to an API or service)
  setTimeout(() => {
    console.log(`Notification sent to ${phoneNumber} with message: ${message}`);

    // Mark the job as completed
    job.progress(100, 100);
    job.complete();
    
    // Call done to mark the job as complete
    done();
  }, 1000); // Simulating delay (e.g., network call)
}

// Create a job and add it to the queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Example of adding jobs to the queue
for (let i = 0; i < 10; i++) {
  queue.create('push_notification_code_2', {
    phoneNumber: `41535187${i + 43}`, // Example phone number
    message: `This is the code ${Math.floor(Math.random() * 10000)} to verify your account`
  }).save();
}

