'use strict'

const test = require('ava')
const requestBuilder = require('../helpers/request_builder')
const TestableBotBuilder = require('../helpers/testable_bot_builder')
const User = require('../../lib/user')

const NOT_EXISTING_USERNAME = 'not.existing.username'
const TESTUSER = new User(
  'xpeppers.user',
  'toggltoken1023jrwdfsd9v',
  8107914,
  'Phoenix'
)

test('set token for user', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const newToken = '129nvwer94emvt9mu349'
  const request = requestBuilder()
    .withUsername(TESTUSER.username)
    .withText('token ' + newToken)
  const expectedSavedUser = new User(TESTUSER.username, newToken, TESTUSER.project.id, TESTUSER.project.description)
  const bot = testableBotBuilder
    .withAlreadySavedUsers([TESTUSER])
    .withExpectedCallsOnSaveUser([expectedSavedUser])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ottimo, ora sono in grado di tracciare per te', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})

test('set token for not existing user', t => {
  const testableBotBuilder = new TestableBotBuilder()
  const newToken = '129nvwer94emvt9mu367'
  const request = requestBuilder()
    .withUsername(NOT_EXISTING_USERNAME)
    .withText('token ' + newToken)
  const expectedSavedUser = new User(NOT_EXISTING_USERNAME, newToken, undefined, undefined)
  const bot = testableBotBuilder
    .withExpectedCallsOnSaveUser([expectedSavedUser])
    .build()

  const response = bot(request)

  return response.then(res => {
    t.is('Ottimo, ora sono in grado di tracciare per te', res)
    testableBotBuilder.verifyMocksExpectations()
  })
})
