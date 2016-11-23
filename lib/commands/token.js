const userRepository = require('../user_repository')
const messages = require('../messages')

const REGEX = /token (.+)/g

function TokenCommand() {

  this.handleRequest = (request) => {
    return request.text.match(REGEX)
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name

    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      user.token = extractNewToken(request)
      return userRepository.save(user).then(() => {
        return messages.tokenSaved(username)
      })
    })
  }

  this.help = () => {
    return ["token <token> - Permette di impostare o cambiare il proprio token toggl"]
  }

  function extractNewToken(request) {
    return REGEX.exec(request.text)[1]
  }
}

module.exports = new TokenCommand()
