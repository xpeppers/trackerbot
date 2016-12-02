const messages = require('../messages')

const commands = [
  require('./project'),
  require('./set_project'),
  require('./today'),
  require('./token'),
]

module.exports = (request) => {
  command = commands.find((command) => {
    return command.handleRequest(request)
  })

  if (undefined == command) {
    const helps = commands.map((command) => {
      return command.help().join('\n')
    }).join('\n')
    return messages.help(helps)
  }

  return command.execute(request)
}
