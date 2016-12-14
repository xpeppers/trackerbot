const userRepository = require('../user_repository')
const tracker = require('../tracker')
const messages = require('../messages')

const XPEPPERS_WORKSPACE_ID = 766453

function SetProjectCommand() {

  this.handleRequest = (request) => {
    return 'proj ls' == request.text
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user )
        return messages.userNotFound(username)

      const toggl = tracker(user.token)
      return toggl.getWorkspaceProjects(XPEPPERS_WORKSPACE_ID)
        .then(projects => {
          return messages.projectsList(projects)
        })
        .catch(() => {
          return messages.trackerError()
        })
    })
  }

  this.help = () => {
    return ["proj ls - Stampa l'elenco dei progetti disponibili su toggl con relativo id."]
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
