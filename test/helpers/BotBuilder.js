'use strict'

const sinon = require('sinon')
const proxyquire = require('proxyquire')

module.exports = function() { return new BotBuilder() }

function BotBuilder() {
  this.today = '2016-11-15'
  this.expectedEntriesTracked = []

  this.withExpectedEntryTracked = function(expected) {
    this.expectedEntriesTracked = expected
    return this
  }

  this.withTodayDate = function(today) {
    this.today = today
    return this
  }

  this.build = function() {
    const momentStub = getMomentStub(this.today)
    const trackerStub = getTrackerStub(this.expectedEntriesTracked)
    const userRepositoryStub = getFakeUserRepository()

    momentStub['@global'] = true
    trackerStub['@global'] = true
    userRepositoryStub['@global'] = true

    return proxyquire('../../lib', {
      'moment': momentStub,
      '../tracker': trackerStub,
      '../user_repository': userRepositoryStub,
    })
  }
}

function getMomentStub(date) {
  return function() { return require('moment-timezone')(date) }
}

function getTrackerStub(expectedEntriesTracked) {
  const tracker = require('../../lib/tracker')('uselessToggleToken')
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
        username: 'xpeppers.user',
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

