'use strict'

const test = require('ava')
var moment = require('moment-timezone')
const DateRange = require('../../lib/date_range')

test('start date should be before end date', t => {
    const monday15 = moment('2018-10-15')
    const saturday20 = moment('2018-10-20')
    const range = new DateRange(saturday20, monday15)

    t.is(true, range.isInvalid())
})