'use strict'
const TogglApi = require('toggl-api')
const moment = require('moment')

module.exports = function(token) {
  return new Tracker(token)
}

function Tracker(token) {
  var toggl = new TogglApi({ apiToken: token })

  this.trackToday = function() {
    trackDate(moment())
  }

  function trackDate(date) {
    toggl.createTimeEntry(new Entry(date.hour(9)), () => {})
    toggl.createTimeEntry(new Entry(date.hour(14)), () => {})
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
