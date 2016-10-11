const assert = require('assert')
const userRepository = require('../lib/user_repository')

describe('UserRepository', function() {
  it('returns user object on given username', function(done) {
    user = userRepository.findFromUsername('testuser', done)

    assert.equal('test_token', user.token)
    assert.equal('test_project', user.project)
  })
})
