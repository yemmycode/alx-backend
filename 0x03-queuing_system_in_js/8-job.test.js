#!/usr/bin/yarn test

const sinon = require('sinon');
const { expect } = require('chai');
const { createQueue } = require('kue');
const createPushNotificationsJobs = require('./8-job.js');

/**
 * Unit tests for the createPushNotificationsJobs function.
 * Verifies job creation, event handling, and error scenarios.
 */
describe('createPushNotificationsJobs', () => {
  // Setup a spy for console logs and create a test queue
  const BIG_BROTHER = sinon.spy(console);
  const QUEUE = createQueue({ name: 'push_notification_code_test' });

  // Enter test mode before running tests
  before(() => {
    QUEUE.testMode.enter(true);
  });

  // Clear and exit test mode after all tests
  after(() => {
    QUEUE.testMode.clear();
    QUEUE.testMode.exit();
  });

  // Reset console log spy history after each test
  afterEach(() => {
    BIG_BROTHER.log.resetHistory();
  });

  // Test: Ensures error is thrown if jobs is not an array
  it('displays an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, QUEUE)).to.throw(
      'Jobs is not an array'
    );
  });

  // Test: Verifies jobs are added to the queue with correct data and type
  it('adds jobs to the queue with the correct type', (done) => {
    expect(QUEUE.testMode.jobs.length).to.equal(0);

    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobInfos, QUEUE);

    expect(QUEUE.testMode.jobs.length).to.equal(2);
    expect(QUEUE.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    expect(QUEUE.testMode.jobs[0].type).to.equal('push_notification_code_3');

    QUEUE.process('push_notification_code_3', () => {
      expect(
        BIG_BROTHER.log.calledWith(
          'Notification job created:',
          QUEUE.testMode.jobs[0].id
        )
      ).to.be.true;
      done();
    });
  });

  // Test: Verifies progress event handler for jobs
  it('registers the progress event handler for a job', (done) => {
    QUEUE.testMode.jobs[0].addListener('progress', () => {
      expect(
        BIG_BROTHER.log.calledWith(
          'Notification job',
          QUEUE.testMode.jobs[0].id,
          '25% complete'
        )
      ).to.be.true;
      done();
    });
    QUEUE.testMode.jobs[0].emit('progress', 25);
  });

  // Test: Verifies failed event handler for jobs
  it('registers the failed event handler for a job', (done) => {
    QUEUE.testMode.jobs[0].addListener('failed', () => {
      expect(
        BIG_BROTHER.log.calledWith(
          'Notification job',
          QUEUE.testMode.jobs[0].id,
          'failed:',
          'Failed to send'
        )
      ).to.be.true;
      done();
    });
    QUEUE.testMode.jobs[0].emit('failed', new Error('Failed to send'));
  });

  // Test: Verifies complete event handler for jobs
  it('registers the complete event handler for a job', (done) => {
    QUEUE.testMode.jobs[0].addListener('complete', () => {
      expect(
        BIG_BROTHER.log.calledWith(
          'Notification job',
          QUEUE.testMode.jobs[0].id,
          'completed'
        )
      ).to.be.true;
      done();
    });
    QUEUE.testMode.jobs[0].emit('complete');
  });
});
