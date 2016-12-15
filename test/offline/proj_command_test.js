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
const TESTUSER_WITHOUT_PROJECT = new User(
  'unemployed.username',
  '10047j34f32023'
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

test('proj command for user without set project', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER_WITHOUT_PROJECT.username)
    .withText('proj')
  const bot = testableBotBuilder
    .withAlreadySavedUsers([TESTUSER, TESTUSER_WITHOUT_PROJECT])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Non so su che progetto tracciare te. Imposta prima il progetto.', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('set project for an existing user', t => {
  const testableBotBuilder = new TestableBotBuilder()
	const request = requestBuilder()
		.withUsername(TESTUSER_WITHOUT_PROJECT.username)
		.withText('proj 9871234 Corte dei Conti')
  const expectedSavedUser = new User(TESTUSER_WITHOUT_PROJECT.username, TESTUSER_WITHOUT_PROJECT.token, '9871234', 'Corte dei Conti')
	const bot = testableBotBuilder
    .withAlreadySavedUsers([TESTUSER, TESTUSER_WITHOUT_PROJECT])
		.withExpectedCallsOnSaveUser([expectedSavedUser])
		.build()

	const response = bot(request)

	return response.then(res => {
		t.is('Ho impostato Corte dei Conti (9871234) come progetto', res)
		testableBotBuilder.verifyMocksExpectations()
	})
})

test('proj list command returns the project list sorted', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('proj ls')
  const bot = testableBotBuilder
    .withAlreadySavedUsers([TESTUSER])
    .build()

  const response = bot(request)
  
  return response.then(res => {
    const expected = 'Ecco i progetti disponibili:\n' +
      "* Altro progetto (3476547)\n" +
      "* Primo progetto (1234567)\n" +
      "* Secondo progetto (9878755)"
    t.is(expected, res)
    testableBotBuilder.verifyMocksExpectations()
	})
})
