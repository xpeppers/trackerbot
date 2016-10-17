'use strict'
const moment = require('moment')

module.exports = function Tracker(togglApiFactory) {

  this.trackToday = function(togglToken) {
    //new TogglApi({ apiToken: togglToken })
    return this.trackDate(moment())
  }

  this.trackDate = function(date) {
    return Promise.all([
      trackTimeEntry(date.hour(9)),
      trackTimeEntry(date.hour(14))
    ])
  }

  function trackTimeEntry(date) {
    return new Promise((resolve, reject) => {
      togglApiFactory
        .buildWith(togglToken)
        .createTimeEntry(new Entry(date), (err, data) => {
          (err) ? reject(err) : resolve(data)
        })
    })
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
