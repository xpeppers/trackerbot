'use strict';
const test = require('ava');
const userRepository = require('../lib/user_repository');

test('returns user object on given username', t => {
  return userRepository.findFromUsername('testuser')
  .then(user => {
    t.is('test_token', user.token);
    t.is('testuser', user.username);
    t.is('123654', user.project_id);
    t.is('Test Proj Description', user.project_description);
  });
});

test('returns error on not founded username', t => {
  return userRepository.findFromUsername('not_existent_username')
  .then(user => {
    t.is(undefined, user);
  });
});

test('save user', t => {
  const user = new User('prova', 'project', 'token')
  return userRepository.save(user)
    .then(() => {
      return userRepository.findFromUsername('prova')
        .then(user => {
          t.is('prova', user.username);
          t.is('project', user.project);
          t.is('token', user.token);
        });
    });
});

function User(username, project, token)
{
  this.username = username
  this.project = project
  this.token = token
}
