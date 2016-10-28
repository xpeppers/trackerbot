'use strict'
const TogglApi = require('toggl-api')

module.exports = function(token) {
  return new Tracker(token)
}

function Tracker(token) {
  var toggl = new TogglApi({ apiToken: token })

  this.createTimeEntry = function(entry) {
    return new Promise((resolve, reject) => {
      toggl.createTimeEntry(entry, (err, data) => {
        (err) ? reject(err) : resolve(data)
      })
    })
  }

  this.trackDate = function(date, projectName) {
    project = projects(projectName)
    return Promise.all([
      createTimeEntry(date.hour(9), project),
      createTimeEntry(date.hour(14), project)
    ])
  }

}

