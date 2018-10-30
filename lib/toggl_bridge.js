'use strict'
const clock = require('./clock')
const TogglApi = require('toggl-api')

module.exports = function (token) {
  return new TogglBridge(token)
}

function TogglBridge(token) {
  var toggl = new TogglApi({ apiToken: token })

  this.createTimeEntry = function (entry) {
    return retryWithBackoff(3, () => new Promise((resolve, reject) => {
      toggl.createTimeEntry(entry, (err, data) => {
        (err) ? reject(err) : resolve(data)
      })
    }))
  }

  this.getWorkspaceProjects = function (workspaceId, options) {
    options = options || { active: true }
    return new Promise((resolve, reject) => {
      toggl.getWorkspaceProjects(workspaceId, options, (err, data) => {
        (err) ? reject(err) : resolve(data.map(adaptProject))
      })
    })
  }

  this.getLastMonthTimeEntries = function () {
    return new Promise((resolve, reject) => {
      const today = clock.today()
      const fromDate = today.clone().subtract(1, 'months').toDate()
      const toDate = today.toDate()

      toggl.getTimeEntries(fromDate, toDate, (err, data) => {
        if (err) { reject(err); return }

        var entries = data
          .map(adaptEntry)
          .sort(fromMostRecentToOlder)

        resolve(entries)
      })
    })
  }

}

const pause = (milliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), milliseconds)
  })
}

const retryWithBackoff = (times, fn, wait = 500) => {
  if (times === 0) return pause(wait).then(fn)

  return pause(wait).then(fn)
    .catch((err) => retryWithBackoff(times - 1, fn, wait * 2))
}

function adaptEntry(entry) {
  return {
    description: entry.description,
    pId: entry.pid,
    date: parseEntryDate(entry.start),
    durationInHour: entry.duration / 60 / 60
  }
}

function parseEntryDate(dateString) {
  return dateString.substring(0, 10)
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
