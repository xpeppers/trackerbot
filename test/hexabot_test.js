'use strict'

const test = require('ava');
const requestBuilder = require('./helpers/RequestBuilder')
const botBuilder = require('./helpers/BotBuilder')

const TESTUSER_USERNAME = 'xpeppers.user'
const TODAY = '2016-10-20'

test('track today command', t => {
  const expectedMorningEntry = entry(8107914, 'Phoenix', TODAY+'T09:00:00+02:00')
  const expectedAfternoonEntry = entry(8107914, 'Phoenix', TODAY+'T14:00:00+02:00')

  const bot = botBuilder()
    .withTodayDate(TODAY)
    .withExpectedEntryTracked([expectedMorningEntry, expectedAfternoonEntry])
    .build()

  const request = requestBuilder().withText('today').withUsername(TESTUSER_USERNAME)

  const response = bot(request)
  return response.then(res => {
    t.is('Ciao ' + TESTUSER_USERNAME + '. Ho tracciato la giornata di oggi.', res)
  })
})

test('proj command returns current project', t => {
  const bot = botBuilder().build()

  const request = requestBuilder().withText('proj').withUsername(TESTUSER_USERNAME);

  const response = bot(request)
  return response.then(res => {
    t.is('Ciao, attualmente sto tracciando su Phoenix (8107914)', res);
  });
})

test.skip('set project for user', t => {
  const bot = botBuilder().build()

  const request = requestBuilder().withText('proj MPOS 9871234').withUsername(TESTUSER_USERNAME);

  const response = bot(request)
  return response.then(res => {
    t.is('Ho settatto MPOS (9871234) come progetto', res);
  });
});

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
