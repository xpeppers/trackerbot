'use strict'
const TogglApi = require('toggl-api')
const projects = require('./projects')

module.exports = function(token) {
  return new Tracker(token)
}

function Tracker(token) {
  var toggl = new TogglApi({ apiToken: token })

  this.trackDate = function(date, projectName) {
    project = projects(projectName)
    return Promise.all([
      createTimeEntry(date.hour(9), project),
      createTimeEntry(date.hour(14), project)
    ])
  }

  function createTimeEntry(date, project) {
    return new Promise((resolve, reject) => {
      toggl.createTimeEntry(new Entry(date, project), (err, data) => {
        (err) ? reject(err) : resolve(data)
      })
    })
  }
}

function Entry(time, project) {
  this.pid = project.id
  this.description = 'Phoenix'
  this.created_with = 'TrackerBot'
  this.duration = 14400
  this.billable = true
  time.second(0)
  time.minutes(0)
  this.start = time.format()
}
