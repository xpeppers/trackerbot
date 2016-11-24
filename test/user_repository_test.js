'use strict';
const test = require('ava');
const userRepository = require('../lib/user_repository');
const User = require('../lib/user');

test('returns user object on given username', t => {
  return userRepository.findFromUsername('testuser')
  .then(user => {
    t.is('test_token', user.token);
    t.is('testuser', user.username);
    t.is('Test Proj Description', user.project.description);
    t.is(123654, user.project.id);
  });
});

test('find user without a set project', t => {
  return userRepository.findFromUsername('unemployed')
  .then(user => {
    t.is('unemployed', user.username);
    t.is('3g9857463h9495', user.token);
    t.is(undefined, user.project.description);
    t.is(undefined, user.project.id);
  });
});

test('returns undefined on not founded username', t => {
  return userRepository.findFromUsername('not_existent_username')
  .then(user => {
    t.is(undefined, user);
  });
});

test('save user', t => {
  const user = new User('prova', 'token', 123456, 'Project')
  return userRepository.save(user)
    .then(() => {
      return userRepository.findFromUsername('prova')
        .then(user => {
          t.is('prova', user.username);
          t.is('token', user.token);
          t.is('Project', user.project.description);
          t.is(123456, user.project.id);
        });
    });
});

test('save user with undefined project', t => {
  const user = new User('userWithoutProject', 'token')
  return userRepository.save(user)
    .then(() => {
      return userRepository.findFromUsername('userWithoutProject')
        .then(user => {
          t.is('userWithoutProject', user.username);
          t.is('token', user.token);
          t.is(undefined, user.project.description);
          t.is(undefined, user.project.id);
        });
    });
});

