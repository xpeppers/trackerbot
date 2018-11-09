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

test('find when all the dates in a range are weekend days', t => {
    const friday19 = moment('2018-10-19')
    const saturday20 = moment('2018-10-20')
    const sunday21 = moment('2018-10-21')
    const monday22 = moment('2018-10-22')

    let range = new DateRange(saturday20, sunday21)
    t.is(true, range.isAWeekend())

    range = new DateRange(saturday20, saturday20)
    t.is(true, range.isAWeekend())

    range = new DateRange(friday19, monday22)
    t.is(false, range.isAWeekend())
})