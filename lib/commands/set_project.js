const userRepository = require('../user_repository')
const messages = require('../messages')

const REGEX = /^proj ([0-9]+) (.+)$/g

function SetProjectCommand() {

  this.handleRequest = (request) => {
    return request.text.match(REGEX)
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user )
        return messages.userNotFound(username)

      user.project = extractProjectFrom(request)
      userRepository.save(user)
      return messages.projectSet(user.project)
    })
  }

  this.help = () => {
    return ["proj <project id> <project name> - Imposta il progetto di default su cui tracciare"]
  }

  function extractProjectFrom(request) {
    const pieces = REGEX.exec(request.text)
    return {
      id: pieces[1],
      description: pieces[2]
    }
  }
}

module.exports = new SetProjectCommand()
