const tokenRepository = require('./TokenRepository')

module.exports = function(request) {
  if (request.text == 'today') {
    username = request.originalRequest.user_name
    token = tokenRepository.findFromUsername(username)
    return "Ciao " + username + ". Ho tracciato la giornata di oggi."
  }
  return ''
}
