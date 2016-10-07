const assert = require('assert')
const sinon = require('sinon')
const TrackerBot = require('../lib/TrackerBot')
const RequestBuilder = require('./RequestBuilder')

const tokenRepository = { findFromUsername: function(){} }

describe('Track today command', function() {
  var bot = new TrackerBot(tokenRepository)

  it('return', function() {
    response = bot(new RequestBuilder().withText("today").withUserName("ettoredelprino").build())

    assert.equal("Ciao ettoredelprino. Il tuo token è undefined", response)
  })
})
