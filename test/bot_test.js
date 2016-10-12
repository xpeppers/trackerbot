'use strict'
const assert = require('assert')
const requestBuilder = require('./RequestBuilder')
const bot = require('../lib/bot')

const ANY_USERNAME = 'ettoredelprino'

describe('Bot', () => {
  it('returns message ok on track today command', () => {
    const request = requestBuilder().withText("today").withUserName(ANY_USERNAME)

    const response = bot(request)

    response.then((res) => {
      assert.equal('Ciao ' + ANY_USERNAME + '. Ho tracciato la giornata di oggi.', res)
    })

  })

  it('returns empty message if function is not founded', () => {
    const response = bot(requestBuilder().withText('no_command'))

    assert.equal('', response)
  })
})
