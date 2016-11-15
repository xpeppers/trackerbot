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
    const trackerMock = getTrackerMock(this.expectedEntriesTracked)
    const userRepositoryMock = getUserRepositoryMock()

    momentStub['@global'] = true
    trackerMock['@global'] = true
    userRepositoryMock['@global'] = true

    return proxyquire('../../lib', {
      'moment': momentStub,
      '../tracker': trackerMock,
      '../user_repository': userRepositoryMock,
    })
  }
}

function getMomentStub(date) {
  return function() { return require('moment-timezone')(date) }
}

function getTrackerMock(expectedEntriesTracked) {
  const tracker = require('../../lib/tracker')('uselessToggleToken')
  const trackerMock = sinon.mock(tracker)

  expectedEntriesTracked.forEach(function(entry) {
    trackerMock.expects("createTimeEntry").once().withArgs(entry).returns(Promise.resolve())
  })

  return function(token) {
    return tracker
  }
}

function getUserRepositoryMock() {
  const repository = { findFromUsername: function() {} }
  const repositoryMock = sinon.mock(repository)

  const userFromRepository = {
    username: 'xpeppers.user',
    token: 'toggltoken1023jrwdfsd9v',
    project: {
      description: 'Phoenix',
      id: 8107914,
    }
  }

  repositoryMock
    .expects('findFromUsername')
    .withArgs('xpeppers.user')
    .returns(Promise.resolve(userFromRepository))

  return repository
}
