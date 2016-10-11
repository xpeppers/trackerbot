const assert = require('assert')
const sinon = require('sinon')
const requestBuilder = require('./RequestBuilder')

const bot = require('../lib/bot')
const userRepository = require('../lib/user_repository')

const ANY_USERNAME = 'username'
const TOKEN = 'token'
const USER_FROM_REPOSITORY = { token: TOKEN, username: ANY_USERNAME }

describe('Bot', function() {
  it('returns message ok on track today command', function() {
    const userRepositoryMock = sinon.mock(userRepository)
    userRepositoryMock.expects("findFromUsername").once().withArgs(ANY_USERNAME).returns(USER_FROM_REPOSITORY)
    request = requestBuilder().withText("today").withUserName(ANY_USERNAME)

    response = bot(request)

    userRepositoryMock.verify()
    assert.equal('Ciao ' + ANY_USERNAME + '. Ho tracciato la giornata di oggi.', response)
    userRepositoryMock.restore()
  })

  it('returns empty message if function is not founded', function() {
    response = bot(requestBuilder().withText('no_command'))

    assert.equal('', response)
  })
})
