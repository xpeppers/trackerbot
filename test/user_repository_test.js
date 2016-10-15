'use strict';
const test = require('ava');
const userRepository = require('../lib/user_repository');

test('returns user object on given username', t => {
  return userRepository.findFromUsername('testuser')
  .then(user => {
    t.is('test_token', user.token);
    t.is('testuser', user.username);
    t.is('test_project', user.project);
  });
});

test('returns error on not founded username', t => {
  return userRepository.findFromUsername('not_existent_username')
  .then(user => {
    t.is(undefined, user);
  });
});
