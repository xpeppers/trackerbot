'use strict'

const sinon = require('sinon')
const proxyquire = require('proxyquire')
const User = require('../../lib/user')

module.exports = BotBuilder

function BotBuilder() {
  this.today = '2016-11-15'
  this.expectedEntriesTracked = []
  this.expectedSavedUsers = []

  this.withExpectedEntryTracked = function(expected) {
    this.expectedEntriesTracked = expected
    return this
  }

  this.withExpectedSavedUsers = function(expected) {
    this.expectedSavedUsers = expected
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
    this.userRepositoryStub = { findFromUsername: function() {}, save: function() {} }
    this.userRepositoryMock = sinon.mock(this.userRepositoryStub)

    const userFromRepository = new User(
      'xpeppers.user',
      'toggltoken1023jrwdfsd9v',
      8107914,
      'Phoenix'
    )

    this.userRepositoryMock
      .expects('findFromUsername')
      .atLeast(0)
      .withArgs('xpeppers.user')
      .returns(Promise.resolve(userFromRepository))

    this.expectedSavedUsers.forEach(function(user) {
      this.userRepositoryMock.expects("save").once().withArgs(user).returns(Promise.resolve())
    }, this)

  }

  function getMomentStub(date) {
    return function() { return require('moment-timezone')(date) }
  }

}
