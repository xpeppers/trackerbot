const userRepository = require('../user_repository')
const tracker = require('../tracker')
const messages = require('../messages')

function ProjectCommand() {

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
}

module.exports = new ProjectCommand()
