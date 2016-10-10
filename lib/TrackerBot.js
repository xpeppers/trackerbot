const tokenRepository = require('./TokenRepository')

module.exports = function(request) {
  token = tokenRepository.findFromUsername(request.originalRequest.user_name)
  return "Ciao " + request.originalRequest.user_name + ". Ho tracciato la giornata di oggi"
}
