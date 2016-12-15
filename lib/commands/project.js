const userRepository = require('../user_repository')
const messages = require('../messages')

function GetProjectCommand() {

  this.handleRequest = (request) => {
    return request.text == 'proj'
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      if (!hasProjectSet(user))
        return messages.userWithoutSetProject()

      return messages.currentProject(user.project)
    })
  }

  this.help = () => {
    return ["proj - Ritorna il progetto di default su cui il bot traccia"]
  }

  function hasProjectSet(user) {
    return undefined != user.project &&
      undefined != user.project.id &&
      undefined != user.project.description
  }
}

module.exports = new GetProjectCommand()
