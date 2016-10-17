'use strict'
const assert = require('assert')
const requestBuilder = require('./RequestBuilder')
const sinon = require('sinon')

const TogglApi = require('toggl-api')
const TrackerBot = require('./lib/bot')
const TogglTracker = require('./tracker')

const USER_USERNAME = 'ettoredelprino'
const USER_TOGGL_TOKEN = 'toggleToken10238471'

describe('Bot', () => {

  it('returns message ok on track today command', () => {
    const mockTogglApi = sinon.mock(TogglApi)
    const bot = new TrackerBot(
      new FakeUserRepository(),
      new TogglTracker(new MockTogglApiFactory(mockTogglApi))
    )

    const expectedMorningEntry = null
    const expectedAfternoonEntry = null

    mockTogglApi.expects("createTimeEntry").once().withExactArgs(expectedMorningEntry)
    mockTogglApi.expects("createTimeEntry").once().withExactArgs(expectedAfternoonEntry)

    const request = requestBuilder().withText("today").withUserName(USER_USERNAME)
    const response = bot.serve(request)

    assert.equal('Ciao ' + USER_USERNAME + '. Ho tracciato la giornata di oggi.', response)
  })

})

var FakeUserRepository = function() {
  
  this.findFromUsername = function() {
    return { token: USER_TOGGL_TOKEN } 
  }

}

var MockTogglApiFactory = function(mockTogglApi) {

  this.buildWith = function(togglToken) {
    return this.mockTogglApi
  }

}
