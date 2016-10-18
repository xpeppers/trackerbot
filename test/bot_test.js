'use strict'
const assert = require('assert')
const requestBuilder = require('./RequestBuilder')
const sinon = require('sinon')

const TogglApi = require('toggl-api')
const TrackerBot = require('../lib/bot')
const TogglTracker = require('../lib/tracker')

const USER_USERNAME = 'ettoredelprino'
const USER_TOGGL_TOKEN = 'toggleToken10238471'

describe('Bot', () => {

  it('returns message ok on track today command', () => {
    const togglApi = new TogglApi()
    const mockTogglApi = sinon.mock(togglApi)
    const bot = new TrackerBot(
      new FakeUserRepository(),
      new TogglTracker(new MockTogglApiFactory(togglApi))
    )

    const expectedMorningEntry = {
      pid: 8107914,
      description: 'Phoenix',
      created_with: 'TrackerBot',
      duration: 14400,
      wid: 766453,
      billable: true,
      start: '2016-10-19T09:00:00+02:00'
    }
    const expectedAfternoonEntry = {
      pid: 8107914,
      description: 'Phoenix',
      created_with: 'TrackerBot',
      duration: 14400,
      wid: 766453,
      billable: true,
      start: '2016-10-19T14:00:00+02:00'
    }

    mockTogglApi.expects("createTimeEntry").once().withExactArgs(expectedMorningEntry)
    mockTogglApi.expects("createTimeEntry").once().withExactArgs(expectedAfternoonEntry)

    const request = requestBuilder().withText("today").withUserName(USER_USERNAME)
    const response = bot.serve(request)

    assert.equal('Ciao ' + USER_USERNAME + '. Ho tracciato la giornata di oggi.', response)

    mockTogglApi.verify()
  })

})

var FakeUserRepository = function() {

  this.findFromUsername = function() {
    return { token: USER_TOGGL_TOKEN }
  }

}

var MockTogglApiFactory = function(mockTogglApi) {

  this.buildWith = function(togglToken) {
    return mockTogglApi
  }

}
