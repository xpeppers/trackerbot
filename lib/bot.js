'use strict'
module.exports = function(userRepository, togglTracker) {

  this.serve = function(request) {
    if (request.text == 'today')
      return serveToday(request)

    return ''
  }

  function serveToday(request) {
    try {
      const username = request.originalRequest.user_name
      const user = userRepository.findFromUsername(username)
      togglTracker.trackToday(user.token)
      return "Ciao " + username + ". Ho tracciato la giornata di oggi."
    } catch(e) {
      console.log('>>> Ops! ' + e + '\n')
      console.log(e.stack)
      return "Scusami .. ma oggi non mi va.."
    }
  }

}
