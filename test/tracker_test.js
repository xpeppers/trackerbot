'use strict'
const assert = require('assert')
const sinon = require('sinon')
const TOKEN = 'any_token'
const tracker = require('../lib/tracker')(TOKEN)

describe('Tracker', () => {
  it.skip('track today', () => {
    return tracker.trackToday().then((entries) => {
      assert.equal(entries.length, 2)
      assert.equal(entries[1].description, 'Phoenix')
      assert.equal(entries[0].description, 'Phoenix')
    })
  })
})
