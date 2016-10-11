const assert = require('assert')
const sinon = require('sinon')
const requestBuilder = require('./RequestBuilder')

const bot = require('../lib/bot')
const tokenRepository = require('../lib/token_repository')

const ANY_USERNAME = 'username'
const TOKEN = 'token'

describe('Bot', function() {
  it('returns message ok on track today command', function() {
    var tokenRepositoryMock = sinon.mock(tokenRepository)
    tokenRepositoryMock.expects("findFromUsername").once().withArgs(ANY_USERNAME).returns(TOKEN)

    response = bot(requestBuilder().withText("today").withUserName(ANY_USERNAME))

    assert.equal('Ciao ' + ANY_USERNAME + '. Ho tracciato la giornata di oggi.', response)
  })

  it('returns empty message if function is not founded', function() {
    response = bot(requestBuilder().withText('no_command'))

    assert.equal('', response)
  })
})
