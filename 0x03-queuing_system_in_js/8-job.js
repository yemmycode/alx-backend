#!/usr/bin/yarn dev

import { Queue, Job } from 'kue';

/**
 * Generates push notification jobs using the provided queue and job data.
 * @param {Job[]} jobs - Array of job details to be added to the queue.
 * @param {Queue} queue - Kue queue instance used for processing jobs.
 */
export const createPushNotificationsJobs = (jobs, queue) => {
  // Validate that jobs is an array
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through each job in the array and add to the queue
  jobs.forEach((jobInfo) => {
    const job = queue.create('push_notification_code_3', jobInfo);

    // Attach event listeners to handle job lifecycle
    job
      .on('enqueue', () => console.log('Notification job created:', job.id))
      .on('complete', () => console.log('Notification job', job.id, 'completed'))
      .on('failed', (err) => console.log('Notification job', job.id, 'failed:', err.message || err.toString()))
      .on('progress', (progress) => console.log('Notification job', job.id, `${progress}% complete`));

    // Save the job to the queue
    job.save();
  });
};

// Export the function for use in other modules
export default createPushNotificationsJobs;
