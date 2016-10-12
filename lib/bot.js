'use strict'
const userRepository = require('./user_repository')
const tracker = require('./tracker')

module.exports = function(request) {
  if (request.text == 'today') {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      return tracker(user.token).trackToday().then(() => {
        return "Ciao " + username + ". Ho tracciato la giornata di oggi."
      })
    })
  }
  return ''
}
