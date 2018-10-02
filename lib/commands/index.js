const messages = require('../messages')

const commands = [
  require('./project'),
  require('./ls_projects'),
  require('./set_project'),
  require('./log'),
  require('./today'),
  require('./monthday'),
  require('./token'),
  require('./dayinterval'),
  require('./dayoff')
]

module.exports = (request) => {
  const command = commands.find((command) => {
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
