'use strict';
const test = require('ava');
const bot = require('../lib');
const requestBuilder = require('./helpers/request_builder');

const TEST_USER = 'test.user';

test('returns error message if token is not found ', t => {
  const request = requestBuilder().withText('today').withUsername('not_existent_user');
  const response = bot(request);

  return response.then(res => {
    t.is('Non ho trovato nessun user associato all\'username: not_existent_user', res);
  });
});

test('return project name for project command', t => {
  const request = requestBuilder().withText('proj').withUsername(TEST_USER);
  const response = bot(request);

  return response.then(res => {
    t.is('Ciao, attualmente sto tracciando su Test Proj Description (26883634)', res);
  });
});

test('return projects list for proj ls command', t => {
  const request = requestBuilder().withText('proj ls').withUsername('dmegna');
  const response = bot(request);

  return response.then(res => {
    t.true(res.includes('Ecco i progetti disponibili:\n'))
    t.true(res.includes('* Assenza (8352044)\n'))
    t.true(res.includes('* Attività interne (8107341)\n'))
    t.true(res.includes('* MPOS (8117873)\n'))
  });
});

test('return error message when proj requested on not existent user', t => {
  const request = requestBuilder().withText('proj').withUsername('not_existent_user');
  const response = bot(request);

  return response.then(res => {
    t.is('Non ho trovato nessun user associato all\'username: not_existent_user', res);
  });
});

test('returns help for no arguments', t => {
  const request = requestBuilder().withText('');
  const response = bot(request);

  t.truthy(response.includes('today - '));
  t.truthy(response.includes('proj - '));
});
