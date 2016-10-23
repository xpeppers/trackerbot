'use strict';

const ava = require('ava');
const requestBuilder = require('./helpers/RequestBuilder');
const proxyquire = require('proxyquire');

const TESTUSER_USERNAME = 'xpeppers.user'
const TESTUSER_TOKEN = 'toggltoken1023jrwdfsd9v'
const TESTUSER = { username: TESTUSER_USERNAME, project: 'phoenix', token: TESTUSER_TOKEN }
const TODAY = require('moment')('2016-10-20')

ava('track today', t => {

  const momentStub = function() { return TODAY }
  const userRepositoryStub = {
    findFromUsername: function(username) {
      return Promise.resolve(TESTUSER)
    }
  }
  const togglApiStub = function(config) {
    this.createTimeEntry = function(entry, callback) {
      callback(null, entry)
    }
  }

  momentStub['@global'] = true
  userRepositoryStub['@global'] = true
  togglApiStub['@global'] = true

  const bot = proxyquire('../lib', {
    'moment': momentStub,
    '../user_repository': userRepositoryStub,
    'toggl-api': togglApiStub
  })

  const request = requestBuilder().withText('today').withUserName(TESTUSER_USERNAME);
  const response = bot(request);

  return response.then(res => {
    t.is('Ciao ' + TESTUSER_USERNAME + '. Ho tracciato la giornata di oggi.', res);
  });
});