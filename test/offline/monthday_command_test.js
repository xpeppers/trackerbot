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

test('track past day in current month', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('18')
  const expectedMorningEntry = entry('2016-10-18T09:00:00+02:00')
  const expectedAfternoonEntry = entry('2016-10-18T14:00:00+02:00')
  const bot = testableBotBuilder
    .withTodayDate(TODAY)
    .withAlreadySavedUsers([TESTUSER])
    .withExpectedCallsOnCreateTimeEntry([expectedMorningEntry, expectedAfternoonEntry])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER.username + '. Ho tracciato la giornata di martedì 18 ottobre sul progetto MPOS (9243852).', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('tracks weekend day when explicitly requested', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('16')
  const expectedMorningEntry = entry('2016-10-16T09:00:00+02:00')
  const expectedAfternoonEntry = entry('2016-10-16T14:00:00+02:00')
  const bot = testableBotBuilder
    .withTodayDate(TODAY)
    .withAlreadySavedUsers([TESTUSER])
    .withExpectedCallsOnCreateTimeEntry([expectedMorningEntry, expectedAfternoonEntry])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER.username + '. Ho tracciato la giornata di domenica 16 ottobre sul progetto MPOS (9243852).', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('it works also between months', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('31')
  const expectedMorningEntry = entry('2016-10-31T09:00:00+01:00')
  const expectedAfternoonEntry = entry('2016-10-31T14:00:00+01:00')
  const bot = testableBotBuilder
    .withTodayDate('2016-11-02')
    .withAlreadySavedUsers([TESTUSER])
    .withExpectedCallsOnCreateTimeEntry([expectedMorningEntry, expectedAfternoonEntry])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER.username + '. Ho tracciato la giornata di lunedì 31 ottobre sul progetto MPOS (9243852).', res)
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
