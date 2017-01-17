'use strict'
const clock = require('./clock')
const TogglApi = require('toggl-api')

module.exports = function(token) {
  return new TogglBridge(token)
}

function TogglBridge(token) {
  var toggl = new TogglApi({ apiToken: token })

  this.createTimeEntry = function(entry) {
    return new Promise((resolve, reject) => {
      toggl.createTimeEntry(entry, (err, data) => {
        (err) ? reject(err) : resolve(data)
      })
    })
  }

  this.getWorkspaceProjects = function(workspaceId, options) {
    options = options || { active: true }
    return new Promise((resolve, reject) => {
      toggl.getWorkspaceProjects(workspaceId, options, (err, data) => {
        (err) ? reject(err) : resolve(data.map(adaptProject))
      })
    })
  }

  this.getLastMonthTimeEntries = function() {
    return new Promise((resolve, reject) => {
      const today = clock.today()
      const fromDate = today.clone().subtract(1, 'months').toDate()
      const toDate = today.toDate()

      toggl.getTimeEntries(fromDate, toDate, (err, data) => {
        if(err) { reject(err); return } 

        var entries = data
          .map(adaptEntry)
          .sort(fromMostRecentToOlder)

        resolve(entries)
      })
    })
  }

  function parseEntryDate(dateString){
    const date = new Date(dateString)
    return new Date(date.getFullYear(),date.getMonth(),date.getDate())
  }

  function adaptEntry(entry) {
    return {
      description: entry.description,
      pId: entry.pid,
      date: parseEntryDate(entry.start),
      durationInHour: entry.duration/60/60
    }
  }

  function fromMostRecentToOlder(a, b) {
    return (a.date > b.date) ? -1 : 1
  }

  function adaptProject(project) {
    return {
      id: project.id,
      name: project.name
    }
  }

}

