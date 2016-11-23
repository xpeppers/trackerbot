'use strict'

const test = require('ava')
const requestBuilder = require('./helpers/RequestBuilder')
const BotBuilder = require('./helpers/BotBuilder')

const TESTUSER_USERNAME = 'xpeppers.user'
const TODAY = '2016-10-20'

test('track today command', t => {
  const request = requestBuilder()
    .withUsername(TESTUSER_USERNAME)
    .withText('today')
  const expectedMorningEntry = entry(8107914, 'Phoenix', TODAY+'T09:00:00+02:00')
  const expectedAfternoonEntry = entry(8107914, 'Phoenix', TODAY+'T14:00:00+02:00')
  const botBuilder = new BotBuilder()
  const bot = botBuilder
    .withTodayDate(TODAY)
    .withExpectedEntryTracked([expectedMorningEntry, expectedAfternoonEntry])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao ' + TESTUSER_USERNAME + '. Ho tracciato la giornata di oggi.', res)
    botBuilder.verifyMocksExpectations()
  })
})

test('proj command returns current project', t => {
  const request = requestBuilder()
    .withUsername(TESTUSER_USERNAME)
    .withText('proj')
  const botBuilder = new BotBuilder()
  const bot = botBuilder.build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao, attualmente sto tracciando su Phoenix (8107914)', res);
    botBuilder.verifyMocksExpectations()
  })
})

test.skip('set project for user', t => {
  const request = requestBuilder()
    .withUsername(TESTUSER_USERNAME)
    .withText('proj MPOS 9871234')
  const botBuilder = new BotBuilder()
  const bot = botBuilder
    .withExpectedSavedUser()
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ho settatto MPOS (9871234) come progetto', res);
    botBuilder.verifyMocksExpectations()
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
