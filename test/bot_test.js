'use strict';
const test = require('ava');
const bot = require('../lib');
const requestBuilder = require('./helpers/RequestBuilder');

const USER_WITH_TEST_TOGGL_TOKEN = 'toggltoken';
const TEST_USER = 'testuser';

test('returns error message if token is not found ', t => {
  const request = requestBuilder().withText('today').withUserName('not_existent_user');
  const response = bot(request);

  return response.then(res => {
    t.is('Non ho trovato nessun user associato all\'username: not_existent_user', res);
  });
});

test('return project name for project command', t => {
  const request = requestBuilder().withText('project').withUserName(TEST_USER);
  const response = bot(request);

  return response.then(res => {
    t.is('Ciao, attualmente sto tracciando su: Test Proj Description', res);
  });
});

test('return project name for project command', t => {
  const request = requestBuilder().withText('project').withUserName('not_existent_user');
  const response = bot(request);

  return response.then(res => {
    t.is('Non ho trovato nessun user associato all\'username: not_existent_user', res);
  });
});


test('returns help for no arguments', t => {
  const request = requestBuilder().withText('');
  const response = bot(request);

  t.truthy(response.includes('today - '));
  t.truthy(response.includes('project - '));
});
