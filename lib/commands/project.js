const userRepository = require('../user_repository')
const tracker = require('../tracker')
const messages = require('../messages')

function GetProjectCommand() {

  this.handleRequest = (request) => {
    return request.text == 'project'
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user ) {
        return messages.userNotFound(username)
      }
      return messages.currentProject(user.project)
    })
  }

  this.help = () => {
    return ["project - Ritorna il progetto di default su cui il bot traccia"]
  }
}

module.exports = new GetProjectCommand()
