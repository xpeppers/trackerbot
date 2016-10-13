'use strict'
const moment = require('moment')
const userRepository = require('./user_repository')
const tracker = require('./tracker')
const messages = require('./messages')

module.exports = function(request) {
  if (request.text == 'today') {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user ) {
        return messages.userNotFound(username)
      }
      return tracker(user.token).trackDate(moment(), 'phoenix')
        .then(() => {
          return messages.trackedToday(username)
        })
        .catch(() => {
          return messages.trackerError()
        })
    })
  }
  return ''
}
