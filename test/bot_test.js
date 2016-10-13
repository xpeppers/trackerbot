'use strict'
const assert = require('assert')
const requestBuilder = require('./RequestBuilder')
const bot = require('../lib')

const USER_WITH_TEST_TOGGL_TOKEN = 'toggltoken'

describe('Bot', function() {
  this.timeout(5000)

  it.skip('returns message ok on track today command', () => {
    const request = requestBuilder().withText("today").withUserName(USER_WITH_TEST_TOGGL_TOKEN)
    const response = bot(request)

    return response.then((res) => {
      assert.equal('Ciao ' + USER_WITH_TEST_TOGGL_TOKEN + '. Ho tracciato la giornata di oggi.', res)
    })
  })

  it('returns error message if token is not found ', () => {
    const request = requestBuilder().withText("today").withUserName('not_existent_user')
    const response = bot(request)

    return response.then((res) => {
      assert.equal('Non ho trovato nessun token associato all\'username: not_existent_user', res)
    })
  })

  it('returns empty message if function is not founded', () => {
    const response = bot(requestBuilder().withText('no_command'))

    assert.equal('', response)
  })
})
