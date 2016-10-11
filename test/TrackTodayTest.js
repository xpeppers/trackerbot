const assert = require('assert')
const sinon = require('sinon')
const requestBuilder = require('./RequestBuilder')

const trackerBot = require('../lib/TrackerBot')
const tokenRepository = require('../lib/TokenRepository')

const ANY_USERNAME = 'username'
const TOKEN = 'token'

describe('Track today command', function() {
  it('returns message ok on track today command', function() {
    var tokenRepositoryMock = sinon.mock(tokenRepository)
    tokenRepositoryMock.expects("findFromUsername").once().withArgs(ANY_USERNAME).returns(TOKEN)

    response = trackerBot(requestBuilder().withText("today").withUserName(ANY_USERNAME))

    assert.equal('Ciao ' + ANY_USERNAME + '. Ho tracciato la giornata di oggi.', response)
  })

  it('returns empty message if function is not founded', function() {
    response = trackerBot(requestBuilder().withText('no_command'))

    assert.equal('', response)
  })
})
