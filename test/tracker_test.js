'use strict'
const assert = require('assert')
const tracker = require('../lib/tracker')
const TODAY = require('moment')()

const TEST_TOKEN = '9b07c50c5126baf8c2d263b3dbfde3ee'

describe('Tracker', () => {
  it.skip('track today', () => {
    return tracker(TEST_TOKEN).trackDate(TODAY, 'phoenix')
      .then((entries) => {
        assert.equal(entries.length, 2)
        assert.equal(entries[1].description, 'Phoenix')
        assert.equal(entries[0].description, 'Phoenix')
      })
  })

  it('throw exception on not existent token', () => {
    return tracker('not_existent_token').trackDate(TODAY, 'phoenix')
      .catch((err) => {
        assert.notEqual(err, undefined)
      })
  })
})
