const userRepository = require('../user_repository')
const tracker = require('../tracker')
const messages = require('../messages')
const moment = require('moment-timezone')

function TodayCommand() {

  this.handleRequest = (request) => {
    return request.text == 'today'
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      if (!hasProjectSet(user))
        return messages.userWithoutSetProject()

      return trackDate(moment().tz("Europe/Rome"), user)
        .then(() => {
          return messages.trackedToday(username)
        })
        .catch(() => {
          return messages.trackerError()
        })
    })
  }

  this.help = () => {
    return ["today - Traccia la giornata di oggi sul progetto di default"]
  }

  function hasProjectSet(user) {
    return undefined != user.project &&
      undefined != user.project.id &&
      undefined != user.project.description
  }

  function trackDate(date, user) {
    const toggl = tracker(user.token)
    return Promise.all([
      toggl.createTimeEntry(new Entry(date.hour(9), user)),
      toggl.createTimeEntry(new Entry(date.hour(14), user))
    ])
  }
}

function Entry(time, user) {
  this.pid = user.project.id
  this.description = user.project.description

  time.second(0)
  time.minutes(0)
  this.start = time.format()
  
  this.created_with = 'TrackerBot'
  this.duration = 14400
  this.billable = true
}

module.exports = new TodayCommand()
