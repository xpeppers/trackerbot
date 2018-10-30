const userRepository = require('./user_repository')
const togglBridge = require('./toggl_bridge')
const messages = require('./messages')
const DateRange = require('./date_range')

function TrackHelper() {

  this.trackDate = function (username, date, project) {
    return this.trackDateRange(username, new DateRange(date, date), project)
  }

  this.trackDateRange = function (username, dateRange, project) {
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      if (dateRange.isInvalid())
        return messages.wrongDateRange()

      const projectToTrack = project || user.project
      if (!isAValidProject(projectToTrack))
        return messages.userWithoutSetProject()

      const promises = []
      const currentDate = dateRange.startDate.clone()
      const skippedDates = []
      while (currentDate.isSameOrBefore(dateRange.endDate)) {
        if (isNotWeekend(currentDate)) {
          promises.push(trackMorningAndAfternoon(currentDate.clone(), user.token, projectToTrack))
        } else {
          skippedDates.push(currentDate.clone())
        }
        currentDate.add(1, 'days')
      }

      return Promise.all(promises).then(() => {
        return messages.trackedDateRange(username, dateRange, skippedDates, projectToTrack)
      }).catch(() => {
        return messages.trackedDateRangeError(username, dateRange)
      })
    })
  }


  function isAValidProject(project) {
    return undefined != project &&
      undefined != project.id &&
      undefined != project.description
  }

  function trackMorningAndAfternoon(date, token, project) {
    const toggl = togglBridge(token)
    return Promise.all([
      toggl.createTimeEntry(new Entry(date.hour(9), project)),
      toggl.createTimeEntry(new Entry(date.hour(14), project))
    ])
  }

  function isNotWeekend(day) {
    return day.isoWeekday() < 6
  }

}

function Entry(time, project) {
  this.pid = project.id
  this.description = project.description

  time.second(0)
  time.minutes(0)
  this.start = time.format()

  this.created_with = 'TrackerBot'
  this.duration = 14400
  this.billable = true

  if (project.tags) {
    this.tags = project.tags
  }
}

module.exports = new TrackHelper()
