const messages = require('../messages')

const commands = [
  require('./today'),
  require('./project')
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
