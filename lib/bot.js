const tokenRepository = require('./token_repository')
const tracker = require('./tracker')

module.exports = function(request) {
  if (request.text == 'today') {
    username = request.originalRequest.user_name
    token = tokenRepository.findFromUsername(username)
    tracker(token).trackToday()
    return "Ciao " + username + ". Ho tracciato la giornata di oggi."
  }
  return ''
}
