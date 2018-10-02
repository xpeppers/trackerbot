'use strict'

const test = require('ava')
const requestBuilder = require('../helpers/request_builder')
const TestableBotBuilder = require('../helpers/testable_bot_builder')
const User = require('../../lib/user')

const TESTUSER = new User(
  'xpeppers.user',
  'toggltoken1023jrwdfsd9v',
  100000,
  'NOT_USED'
)

test('log command shows last entries tracked', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('log')
  const bot = testableBotBuilder
    .withAlreadySavedUsers([TESTUSER])
    .build()

  const response = bot(request)
  const expected = 'Hai recentemente tracciato:\n' +
    "- martedì 03 gennaio 8h sul progetto MPOS (9243852).\n" +
    "- lunedì 02 gennaio 8h sul progetto MPOS (9243852)."

  return response.then(res => {
    t.is(expected, res)
    testableBotBuilder.verifyMocksExpectations()
  })
})
