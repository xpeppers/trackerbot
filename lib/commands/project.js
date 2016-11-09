const userRepository = require('../user_repository')
const messages = require('../messages')

function GetProjectCommand() {

  this.handleRequest = (request) => {
    return request.text == 'proj'
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user ) {
        return messages.userNotFound(username)
      }
      return messages.currentProject(user.project_description, user.project_id)
    })
  }

  this.help = () => {
    return ["proj - Ritorna il progetto di default su cui il bot traccia"]
  }
}

module.exports = new GetProjectCommand()
