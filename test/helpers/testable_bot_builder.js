'use strict'

const sinon = require('sinon')
const proxyquire = require('proxyquire')
const User = require('../../lib/user')

module.exports = function() {
  this.today = '2016-11-15'
  this.expectedCallsOnCreateTimeEntry = []
  this.expectedCallsOnSaveUser = []

  this.withExpectedCallsOnCreateTimeEntry = function(expected) {
    this.expectedCallsOnCreateTimeEntry = expected
    return this
  }

  this.withExpectedCallsOnSaveUser = function(expected) {
    this.expectedCallsOnSaveUser = expected
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

    this.expectedCallsOnCreateTimeEntry.forEach(function(entry) {
      this.trackerMock.expects("createTimeEntry").once().withArgs(entry).returns(Promise.resolve())
    }, this)

    this.trackerStub = function(token) {
      return trackerPrototype
    }
  }

  this.buildUserRepositoryMocks = function() {
    this.userRepositoryStub = { findFromUsername: function() {}, save: function() {} }
    this.userRepositoryMock = sinon.mock(this.userRepositoryStub)

    const users = [
      new User(
        'xpeppers.user',
        'toggltoken1023jrwdfsd9v',
        8107914,
        'Phoenix'
      ),
      new User(
        'unemployed.username',
        'toggltoken1023jrwdfsd9v'
      )
    ]

    users.forEach(user => {
      this.userRepositoryMock
        .expects('findFromUsername')
        .atLeast(0)
        .withArgs(user.username)
        .returns(Promise.resolve(user))
    }, this)

    this.expectedCallsOnSaveUser.forEach(user => {
      this.userRepositoryMock
        .expects("save").once()
        .withArgs(user)
        .returns(Promise.resolve())
    }, this)

    this.userRepositoryMock
      .expects('findFromUsername')
      .atLeast(0)
      .returns(Promise.resolve(undefined))
  }

  function getMomentStub(date) {
    return function() { return require('moment-timezone')(date) }
  }

}
