const tokenRepository = require('./TokenRepository')

module.exports = function(request) {
  token = tokenRepository.findFromUsername(request.originalRequest.user_name)
  return "Ciao " + request.originalRequest.user_name + ". Il tuo token è " + token
}
