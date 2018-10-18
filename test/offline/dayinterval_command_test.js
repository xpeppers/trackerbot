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
    entry('2016-10-17T09:00:00+02:00'),
    entry('2016-10-17T14:00:00+02:00'),
    entry('2016-10-18T09:00:00+02:00'),
    entry('2016-10-18T14:00:00+02:00'),
    entry('2016-10-19T09:00:00+02:00'),
    entry('2016-10-19T14:00:00+02:00'),
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

test(`don't track weekends`, t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('14-17')

  const expectedEntries = [
    entry('2016-10-14T09:00:00+02:00'),
    entry('2016-10-14T14:00:00+02:00'),
    entry('2016-10-17T09:00:00+02:00'),
    entry('2016-10-17T14:00:00+02:00')
  ]
  const bot = testableBotBuilder
    .withTodayDate(TODAY)
    .withAlreadySavedUsers([TESTUSER])
    .withExpectedCallsOnCreateTimeEntry(expectedEntries)
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER.username + '. Ho tracciato le giornate da venerdì 14 ottobre a lunedì 17 ottobre (tralasciando sabato 15, domenica 16) sul progetto MPOS (9243852).', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('wrong ranges cannot be tracked', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('20-17')

  const bot = testableBotBuilder
    .withTodayDate(TODAY)
    .withAlreadySavedUsers([TESTUSER])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Il range specificato non è un range valido.', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

function entry(startTime) {
  return {
    pid: TESTUSER.project.id,
    description: TESTUSER.project.description,
    created_with: 'TrackerBot',
    duration: 14400,
    billable: true,
    start: startTime
  }
}
