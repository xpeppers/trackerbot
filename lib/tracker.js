'use strict'
const moment = require('moment')

module.exports = function Tracker(togglApiFactory) {

  this.trackToday = function(togglToken) {
    return this.trackDate(togglToken, moment())
  }

  this.trackDate = function(togglToken, date) {
    trackTimeEntry(togglToken, date.hour(9))
    trackTimeEntry(togglToken, date.hour(14))
  }

  function trackTimeEntry(togglToken, date) {
    togglApiFactory
      .buildWith(togglToken)
      .createTimeEntry(new Entry(date))
  }
}

function Entry(time) {
  this.pid = 8107914
  this.description = 'Phoenix'
  this.created_with = 'TrackerBot'
  this.duration = 14400
  this.wid = 766453
  this.billable = true
  time.second(0)
  time.minutes(0)
  this.start = time.format()
}
