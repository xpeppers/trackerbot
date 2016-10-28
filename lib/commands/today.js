const userRepository = require('../user_repository')
const tracker = require('../tracker')
const messages = require('../messages')
const projects = require('../projects')
const moment = require('moment')

function TodayCommand() {

  this.handleRequest = (request) => {
    return request.text == 'today'
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user )
        return messages.userNotFound(username)

      return trackDate(moment(), user)
        .then(() => {
          return messages.trackedToday(username)
        })
        .catch(() => {
          return messages.trackerError()
        })
    })
  }

  function trackDate(date, user) {
    const toggl = tracker(user.token)
    project = projects(user.project)
    return Promise.all([
      toggl.createTimeEntry(new Entry(date.hour(9), project)),
      toggl.createTimeEntry(new Entry(date.hour(14), project))
    ])
  }

  this.help = () => {
    return ["today - Traccia la giornata di oggi sul progetto di default"]
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

module.exports = new TodayCommand()
