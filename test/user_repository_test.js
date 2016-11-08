'use strict';
const test = require('ava');
const userRepository = require('../lib/user_repository');

test('returns user object on given username', t => {
  return userRepository.findFromUsername('testuser')
  .then(user => {
    t.is('test_token', user.token);
    t.is('testuser', user.username);
    t.is('Test Proj Description', user.project_description);
    t.is('123654', user.project_id);
  });
});

test('returns undefined on not founded username', t => {
  return userRepository.findFromUsername('not_existent_username')
  .then(user => {
    t.is(undefined, user);
  });
});

test('save user', t => {
  const user = new User('prova', 'token', 'Project', '123456')
  return userRepository.save(user)
    .then(() => {
      return userRepository.findFromUsername('prova')
        .then(user => {
          t.is('prova', user.username);
          t.is('token', user.token);
          t.is('Project', user.project_description);
          t.is('123456', user.project_id);
        });
    });
});

function User(username, token, project_description, project_id)
{
  this.username = username
  this.token = token
  this.project_description = project_description
  this.project_id = project_id
}
