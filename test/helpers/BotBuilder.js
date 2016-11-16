'use strict'

const sinon = require('sinon')
const proxyquire = require('proxyquire')

module.exports = BotBuilder

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

  this.verifyMocksExpectations = function() {
    this.trackerMock.verify()
    this.userRepositoryMock.verify()
  }

  this.build = function() {
    const moment = getMomentStub(this.today)
    this.buildUserRepositoryMocks()
    this.buildTrackerMocks()

    moment['@global'] = true
    this.userRepositoryStub['@global'] = true
    this.trackerStub['@global'] = true

    return proxyquire('../../lib', {
      'moment': moment,
      '../user_repository': this.userRepositoryStub,
      '../tracker': this.trackerStub,
    })
  }

  this.buildTrackerMocks = function() {
    const trackerPrototype = require('../../lib/tracker')('uselessToggleToken')
    this.trackerMock = sinon.mock(trackerPrototype)

    this.expectedEntriesTracked.forEach(function(entry) {
      this.trackerMock.expects("createTimeEntry").once().withArgs(entry).returns(Promise.resolve())
    }, this)

    this.trackerStub = function(token) {
      return trackerPrototype
    }
  }

  this.buildUserRepositoryMocks = function() {
    this.userRepositoryStub = { findFromUsername: function() {} }
    this.userRepositoryMock = sinon.mock(this.userRepositoryStub)

    const userFromRepository = {
      username: 'xpeppers.user',
      token: 'toggltoken1023jrwdfsd9v',
      project: {
        description: 'Phoenix',
        id: 8107914,
      }
    }

    this.userRepositoryMock
      .expects('findFromUsername')
      .withArgs('xpeppers.user')
      .returns(Promise.resolve(userFromRepository))
  }

  function getMomentStub(date) {
    return function() { return require('moment-timezone')(date) }
  }

  function getUserRepositoryMock() {
  }

}
