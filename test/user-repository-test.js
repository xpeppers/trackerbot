'use strict';
const assert = require('assert');
const userRepository = require('../lib/user-repository');

describe('UserRepository', function () {
	this.timeout(5000);

	it('returns user object on given username', () => {
		return userRepository.findFromUsername('testuser')
      .then(user => {
	assert.equal('test_token', user.token);
	assert.equal('testuser', user.username);
	assert.equal('test_project', user.project);
});
	});

	it('returns error on not founded username', () => {
		return userRepository.findFromUsername('not_existent_username')
      .then(user => {
	assert.equal(undefined, user);
});
	});
});
