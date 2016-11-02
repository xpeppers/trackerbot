'use strict'

const ava = require('ava')
const requestBuilder = require('./helpers/RequestBuilder')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const TESTUSER_USERNAME = 'xpeppers.user'

ava('track today', t => {

	const expectedMorningEntry = entry(8107914, 'Phoenix', '2016-10-20T09:00:00+02:00')
	const expectedAfternoonEntry = entry(8107914, 'Phoenix', '2016-10-20T14:00:00+02:00')

	const bot = buildBot('2016-10-20', expectedMorningEntry, expectedAfternoonEntry)
  const request = requestBuilder().withText('today').withUserName(TESTUSER_USERNAME)

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER_USERNAME + '. Ho tracciato la giornata di oggi.', res)
  })

})

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

function buildBot(date, expectedMorningEntry, expectedAfternoonEntry) {
  const momentStub = getMomentStub(date)
  const userRepositoryStub = getFakeUserRepository()
  const trackerStub = getTrackerStub(expectedMorningEntry, expectedAfternoonEntry)

  momentStub['@global'] = true
  userRepositoryStub['@global'] = true
  trackerStub['@global'] = true

  return proxyquire('../lib', {
    'moment': momentStub,
    '../user_repository': userRepositoryStub,
    '../tracker': trackerStub
  })
}

function getMomentStub(date) {
  return function() { return require('moment')(date) }
}

function getTrackerStub(expectedMorningEntry, expectedAfternoonEntry) {
  const tracker = require('../lib/tracker')('uselessToggleToken')
  const trackerMock = sinon.mock(tracker)

  trackerMock.expects("createTimeEntry").once().withArgs(expectedMorningEntry).returns(Promise.resolve())
  trackerMock.expects("createTimeEntry").once().withArgs(expectedAfternoonEntry).returns(Promise.resolve())

  return function(token) {
    return tracker
  }

}

function getFakeUserRepository() {
  return {
    findFromUsername: function(username) {
			const userFromRepository = { username: TESTUSER_USERNAME, project: 'phoenix', token: 'toggltoken1023jrwdfsd9v' }
      return Promise.resolve(userFromRepository)
    }
  }
}

