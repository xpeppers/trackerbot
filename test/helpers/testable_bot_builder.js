'use strict'

const sinon = require('sinon')
const proxyquire = require('proxyquire')
const User = require('../../lib/user')

module.exports = function() {
  this.today = '2016-11-15'
  this.expectedCallsOnCreateTimeEntry = []
  this.expectedCallsOnSaveUser = []
  this.alreadySavedUsers = []

  this.withAlreadySavedUsers = function(users) {
    this.alreadySavedUsers = users
    return this
  }

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
    this.togglBridgeMock.verify()
    this.userRepositoryMock.verify()
  }

  this.build = function() {
    const momentStub = buildMomentStub(this.today)
    this.buildUserRepositoryMocks()
    this.buildTrackerMocks()

    momentStub['@global'] = true
    this.userRepositoryStub['@global'] = true
    this.togglBridgeStub['@global'] = true

    return proxyquire('../../lib', {
      'moment-timezone': momentStub,
      './user_repository': this.userRepositoryStub,
      '../user_repository': this.userRepositoryStub,
      './toggl_bridge': this.togglBridgeStub,
      '../toggl_bridge': this.togglBridgeStub,
    })
  }

  this.buildTrackerMocks = function() {
    const togglBridgePrototype = require('../../lib/toggl_bridge')('uselessToggleToken')
    this.togglBridgeMock = sinon.mock(togglBridgePrototype)

    const projectsFromToggl = [
      { name: 'Primo progetto', id: 1234567 },
      { name: 'Secondo progetto', id: 9878755 },
      { name: 'Altro progetto', id: 3476547 },
    ]
    this.togglBridgeMock
      .expects("getWorkspaceProjects")
      .atLeast(0)
      .returns(Promise.resolve(projectsFromToggl))

    this.expectedCallsOnCreateTimeEntry.forEach(function(entry) {
      this.togglBridgeMock.expects("createTimeEntry").once().withArgs(entry).returns(Promise.resolve())
    }, this)

    this.togglBridgeStub = function(token) {
      return togglBridgePrototype
    }
  }

  this.buildUserRepositoryMocks = function() {
    this.userRepositoryStub = { findFromUsername: function() {}, save: function() {} }
    this.userRepositoryMock = sinon.mock(this.userRepositoryStub)

    this.alreadySavedUsers.forEach(user => {
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

  function buildMomentStub(todayDate) {
    return function() {
      return require('moment-timezone')(todayDate).tz('America/New_York')
    }
  }

}
