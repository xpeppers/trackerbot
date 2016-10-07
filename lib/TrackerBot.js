module.exports = function(tokenRepository) {
  return function(request) {
    token = tokenRepository.findFromUsername(request.originalRequest.user_name)
    return "Ciao " + request.originalRequest.user_name + ". Il tuo token è " + token
  }
}
