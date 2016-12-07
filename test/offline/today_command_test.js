'use strict'

const test = require('ava')
const requestBuilder = require('../helpers/request_builder')
const TestableBotBuilder = require('../helpers/testable_bot_builder')
const User = require('../../lib/user')

const TODAY = '2016-10-20'
const NOT_EXISTING_USERNAME = 'not.existing.username'
const TESTUSER_WITHOUT_PROJECT = new User(
  'unemployed.username',
  '10047j34f32023'
)
const TESTUSER = new User(
  'xpeppers.user',
  'toggltoken1023jrwdfsd9v',
  8107914,
  'Phoenix'
)

test('track today command', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('today')
  const expectedMorningEntry = entry(TESTUSER.project.id, TESTUSER.project.description, TODAY+'T09:00:00+02:00')
  const expectedAfternoonEntry = entry(TESTUSER.project.id, TESTUSER.project.description, TODAY+'T14:00:00+02:00')
  const bot = testableBotBuilder
    .withTodayDate(TODAY)
    .withAlreadySavedUsers([TESTUSER])
    .withExpectedCallsOnCreateTimeEntry([expectedMorningEntry, expectedAfternoonEntry])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER.username + '. Ho tracciato la giornata Thursday, October 20th 2016 sul progetto Phoenix (8107914).', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('track today command with not existing user', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(NOT_EXISTING_USERNAME)
    .withText('today')
  const bot = testableBotBuilder.build()

  const response = bot(request)

  return response.then(res => {
    t.is('Non ho trovato nessun user associato all\'username: ' + NOT_EXISTING_USERNAME, res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('track today for an existing user without set project', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER_WITHOUT_PROJECT.username)
    .withText('today')
  const bot = testableBotBuilder
    .withAlreadySavedUsers([TESTUSER_WITHOUT_PROJECT])
    .build()

  const response = bot(request)
	return response.then(res => {
    t.is('Non so su che progetto tracciare te. Imposta prima il progetto.', res)
		testableBotBuilder.verifyMocksExpectations()
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
