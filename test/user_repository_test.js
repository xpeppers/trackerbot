'use strict'
const assert = require('assert')
const userRepository = require('../lib/user_repository')

describe('UserRepository', function() {
  it('returns user object on given username', function() {
    this.timeout(5000)
    return userRepository.findFromUsername('testuser')
    .then(function(user) {
      assert.equal('test_token', user.token)
      assert.equal('testuser', user.username)
      assert.equal('test_project', user.project)
    })
  })
})
