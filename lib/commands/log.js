const userRepository = require('../user_repository')
const togglBridge = require('../toggl_bridge')
const messages = require('../messages')

function LogCommand() {

  this.handleRequest = (request) => {
    return request.text == 'log'
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    return userRepository.findFromUsername(username).then((user) => {
      if (undefined == user)
        return messages.userNotFound(username)

      const toggl = togglBridge(user.token)
      return toggl.getLastMonthTimeEntries()
        .then(entries => {
          return messages.trackedEntriesLog(entries)
        })
    })
  }

  this.help = () => {
    return ["log - Mostra le ultime giornate traccate su toggl."]
  }

}

module.exports = new LogCommand()
