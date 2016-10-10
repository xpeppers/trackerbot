const tokenRepository = require('./TokenRepository')

module.exports = function(request) {
  username = request.originalRequest.user_name
  token = tokenRepository.findFromUsername(username)
  return "Ciao " + username + ". Ho tracciato la giornata di oggi"
}
