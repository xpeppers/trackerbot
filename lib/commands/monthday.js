const userRepository = require('../user_repository')
const tracker = require('../tracker')
const messages = require('../messages')
const moment = require('moment-timezone')

const REGEX = /^([0-9]{1,2})$/g

function MonthDayCommand() {

  this.handleRequest = (request) => {
    return request.text.match(REGEX)
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      if (!hasProjectSet(user))
        return messages.userWithoutSetProject()

      const targetDayOfMonth = extractDayOfMonthFrom(request)
      const today = moment().tz("Europe/Rome")
      const target = today.clone().date(targetDayOfMonth)
      if (target > today)
        target = target.subtract(1, 'months')

      return trackDate(target, user)
        .then(() => {
          return messages.trackedDate(username, target)
        })
        .catch(() => {
          return messages.trackerError()
        })
    })
  }

  this.help = () => {
    return ["<day of month> - Traccia il giorno del mese più vicino nel passato."]
  }

  function extractDayOfMonthFrom(request) {
    return REGEX.exec(request.text)[1]
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

module.exports = new MonthDayCommand()
