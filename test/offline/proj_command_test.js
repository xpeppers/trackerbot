'use strict'

const test = require('ava')
const requestBuilder = require('../helpers/request_builder')
const TestableBotBuilder = require('../helpers/testable_bot_builder')
const User = require('../../lib/user')

const TESTUSER = new User(
  'xpeppers.user',
  'toggltoken1023jrwdfsd9v',
  8107914,
  'Phoenix'
)

test('proj command returns current project', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('proj')
  const bot = testableBotBuilder
    .withAlreadySavedUsers([TESTUSER])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ciao, attualmente sto tracciando su Phoenix (8107914)', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test.skip('set project for an existing user', t => {
  const testableBotBuilder = new TestableBotBuilder()
	const request = requestBuilder()
		.withUsername(TESTUSER.username)
		.withText('proj 9871234 Corte dei Conti')
  const expectedSavedUser = new User(TESTUSER.username, TESTUSER.token, 9871234, 'Corte dei Conti')
	const bot = testableBotBuilder
		.withExpectedCallsOnSaveUser([expectedSavedUser])
		.build()

	const response = bot(request)

	return response.then(res => {
		t.is('Ho impostato Corte dei Conti (9871234) come progetto', res)
		testableBotBuilder.verifyMocksExpectations()
	})
})
