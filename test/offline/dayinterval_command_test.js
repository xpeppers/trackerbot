'use strict'

const test = require('ava')
const requestBuilder = require('../helpers/request_builder')
const TestableBotBuilder = require('../helpers/testable_bot_builder')
const User = require('../../lib/user')

const TODAY = '2016-10-20'
const TESTUSER = new User(
  'xpeppers.user',
  'toggltoken1023jrwdfsd9v',
  9243852,
  'MPOS'
)

test('track past days in current month', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('17-19')

  const expectedEntries = [
    entry(TESTUSER.project.id, TESTUSER.project.description, '2016-10-17T09:00:00+02:00'),
    entry(TESTUSER.project.id, TESTUSER.project.description, '2016-10-17T14:00:00+02:00'),
    entry(TESTUSER.project.id, TESTUSER.project.description, '2016-10-18T09:00:00+02:00'),
    entry(TESTUSER.project.id, TESTUSER.project.description, '2016-10-18T14:00:00+02:00'),
    entry(TESTUSER.project.id, TESTUSER.project.description, '2016-10-19T09:00:00+02:00'),
    entry(TESTUSER.project.id, TESTUSER.project.description, '2016-10-19T14:00:00+02:00'),
  ]
  const bot = testableBotBuilder
    .withTodayDate(TODAY)
    .withAlreadySavedUsers([TESTUSER])
    .withExpectedCallsOnCreateTimeEntry(expectedEntries)
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER.username + '. Ho tracciato le giornate da lunedì 17 ottobre a mercoledì 19 ottobre sul progetto MPOS (9243852).', res)
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
