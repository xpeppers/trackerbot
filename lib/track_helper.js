const userRepository = require('./user_repository')
const togglBridge = require('./toggl_bridge')
const messages = require('./messages')

function TrackHelper() {

  this.trackDate = function (username, date) {
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      if (!hasProjectSet(user))
        return messages.userWithoutSetProject()

      return trackMorningAndAfternoon(date, user)
        .then(() => {
          return messages.trackedDate(username, date, user.project)
        })
        .catch(() => {
          return messages.trackerError()
        })
    })
  }

  this.trackDateRange = function (username, startDate, endDate) {
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      if (!hasProjectSet(user))
        return messages.userWithoutSetProject()

      if(startDate > endDate)
        return messages.wrongDateRange()

      const promises = []
      const actual = startDate.clone()
      while (actual.isSameOrBefore(endDate)) {
        promises.push(trackMorningAndAfternoon(actual.clone(), user))
        actual.add(1, 'days')
      }

      return Promise.all(promises).then(() => {
        return messages.trackedDateRange(username, startDate, endDate, user.project)
      })
    })
  }

  this.trackDayOff = function (username, date) {
    const DEFAULT_HOLIDAY_PROJECT = {
      id: "8352044",
      description: "Assenza"
    }

    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      user.project = DEFAULT_HOLIDAY_PROJECT
      return trackMorningAndAfternoon(date, user, ["Ferie"])
        .then(() => {
          return messages.trackedDate(username, date, DEFAULT_HOLIDAY_PROJECT)
        })
        .catch(() => {
          return messages.trackerError()
        })
    })
  }

  function hasProjectSet(user) {
    return undefined != user.project &&
      undefined != user.project.id &&
      undefined != user.project.description
  }

  function trackMorningAndAfternoon(date, user, tags) {
    const toggl = togglBridge(user.token)
    return Promise.all([
      toggl.createTimeEntry(new Entry(date.hour(9), user, tags)),
      toggl.createTimeEntry(new Entry(date.hour(14), user, tags))
    ])
  }


}

function Entry(time, user, tags) {
  this.pid = user.project.id
  this.description = user.project.description

  time.second(0)
  time.minutes(0)
  this.start = time.format()

  this.created_with = 'TrackerBot'
  this.duration = 14400
  this.billable = true

  if (tags) {
    this.tags = tags
  }
}

module.exports = new TrackHelper()
