'use strict'

const test = require('ava');
const requestBuilder = require('./helpers/RequestBuilder')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const TESTUSER_USERNAME = 'xpeppers.user'
const NOTEXISTING_USERNAME = 'xpeppers.user'
const TODAY = '2016-10-20'

test('track today command', t => {
  const expectedMorningEntry = entry(8107914, 'Phoenix', TODAY+'T09:00:00+02:00')
  const expectedAfternoonEntry = entry(8107914, 'Phoenix', TODAY+'T14:00:00+02:00')

  const bot = new BotBuilder()
    .withExpectedEntryTracked([expectedMorningEntry, expectedAfternoonEntry])
    .build()
  const request = requestBuilder().withText('today').withUserName(TESTUSER_USERNAME)

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER_USERNAME + '. Ho tracciato la giornata di oggi.', res)
  })
})

test('proj command returns current project', t => {
  const bot = new BotBuilder().build()
  const request = requestBuilder().withText('proj').withUserName(TESTUSER_USERNAME);

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao, attualmente sto tracciando su Phoenix (8107914)', res);
  });
})

test.skip('set project for user', t => {
  const bot = new BotBuilder().build()
  const request = requestBuilder().withText('proj MPOS 9871234').withUserName(TESTUSER_USERNAME);

  const response = bot(request)

  return response.then(res => {
    t.is('Ho settatto MPOS (9871234) come progetto', res);
  });
});

function BotBuilder() {
  this.today = TODAY
  this.expectedEntriesTracked = []

  this.withExpectedEntryTracked = function(expected) {
    this.expectedEntriesTracked = expected
    return this
  }

  this.build = function() {
    const momentStub = getMomentStub(this.today)
    const userRepositoryStub = getFakeUserRepository()
    const trackerStub = getTrackerStub(this.expectedEntriesTracked)

    momentStub['@global'] = true
    userRepositoryStub['@global'] = true
    trackerStub['@global'] = true

    return proxyquire('../lib', {
      'moment': momentStub,
      '../user_repository': userRepositoryStub,
      '../tracker': trackerStub
    })
  }
}

function getMomentStub(date) {
  return function() { return require('moment-timezone')(date) }
}

function getTrackerStub(expectedEntriesTracked) {
  const tracker = require('../lib/tracker')('uselessToggleToken')
  const trackerMock = sinon.mock(tracker)

  expectedEntriesTracked.forEach(function(entry) {
    trackerMock.expects("createTimeEntry").once().withArgs(entry).returns(Promise.resolve())
  })

  return function(token) {
    return tracker
  }
}

function getFakeUserRepository() {
  return {
    findFromUsername: function(username) {
      const userFromRepository = {
        username: TESTUSER_USERNAME,
        token: 'toggltoken1023jrwdfsd9v',
        project: {
          description: 'Phoenix',
          id: 8107914,
        }
      }

      return Promise.resolve(userFromRepository)
    }
  }
}

function entry(pid, description, startTime) {
  return {
    pid: pid,
    description: description,
    created_with: 'TrackerBot',
    duration: 14400,
    billable: true,
    start: startTime
  }
}
