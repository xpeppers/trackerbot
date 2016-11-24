'use strict'

const test = require('ava')
const requestBuilder = require('./helpers/request_builder')
const TestableBotBuilder = require('./helpers/testable_bot_builder')
const User = require('../lib/user')

const TODAY = '2016-10-20'
const NOT_EXISTING_USERNAME = 'not.existing.username'
const TESTUSER = new User(
  'xpeppers.user',
  'toggltoken1023jrwdfsd9v',
  8107914,
  'Phoenix'
)

var testableBotBuilder
test.beforeEach(t => {
  testableBotBuilder = new TestableBotBuilder()
})

test('track today command', t => {
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('today')
  const expectedMorningEntry = entry(8107914, 'Phoenix', TODAY+'T09:00:00+02:00')
  const expectedAfternoonEntry = entry(8107914, 'Phoenix', TODAY+'T14:00:00+02:00')
  const bot = testableBotBuilder
    .withTodayDate(TODAY)
    .withExpectedEntryTracked([expectedMorningEntry, expectedAfternoonEntry])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER.username + '. Ho tracciato la giornata di oggi.', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('track today command with not existing user', t => {
  const request = requestBuilder()
    .withUsername(NOT_EXISTING_USERNAME)
    .withText('today')
  const bot = testableBotBuilder.build()

  const response = bot(request)

  return response.then(res => {
    t.is('Non ho trovato nessun user associato all\'username: not.existing.username', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('proj command returns current project', t => {
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('proj')
  const bot = testableBotBuilder.build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao, attualmente sto tracciando su Phoenix (8107914)', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('set token for user', t => {
  const newToken = '129nvwer94emvt9mu349'
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('token ' + newToken)
  const expectedSavedUser = new User(TESTUSER.username, newToken, TESTUSER.project.id, TESTUSER.project.description)
  const bot = testableBotBuilder
    .withExpectedSavedUsers([expectedSavedUser])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ottimo, ora sono in grado di tracciare per te', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('set token for not existing user', t => {
  const newToken = '129nvwer94emvt9mu367'
  const request = requestBuilder()
    .withUsername(NOT_EXISTING_USERNAME)
    .withText('token ' + newToken)
  const expectedSavedUser = new User(NOT_EXISTING_USERNAME, newToken, undefined, undefined)
  const bot = testableBotBuilder
    .withExpectedSavedUsers([expectedSavedUser])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ottimo, ora sono in grado di tracciare per te', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test.skip('set project for user', t => {
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('proj 9871234 Corte dei Conti')
  const bot = testableBotBuilder
    .withExpectedSavedUsers([expectedSavedUser])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ho settatto MPOS (9871234) come progetto', res)
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
