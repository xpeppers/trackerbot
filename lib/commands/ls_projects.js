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

      console.log("HEREWEARE")
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
