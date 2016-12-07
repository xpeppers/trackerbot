const userRepository = require('./user_repository')
const tracker = require('./tracker')
const messages = require('./messages')

function TrackHelper() {

  this.trackDate = function(username, date) {
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

  function hasProjectSet(user) {
    return undefined != user.project &&
      undefined != user.project.id &&
      undefined != user.project.description
  }

  function trackMorningAndAfternoon(date, user) {
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

module.exports = new TrackHelper()
