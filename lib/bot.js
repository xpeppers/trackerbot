const userRepository = require('./user_repository')
const tracker = require('./tracker')

module.exports = function(request) {
  if (request.text == 'today') {
    username = request.originalRequest.user_name
    user = userRepository.findFromUsername(username)
    tracker(user.token).trackToday()
    return "Ciao " + username + ". Ho tracciato la giornata di oggi."
  }
  return ''
}
