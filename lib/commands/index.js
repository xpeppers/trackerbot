const messages = require('../messages')

const commands = require("fs").readdirSync(__dirname)
  .filter( (fileName)=> fileName !== 'index.js')
  .map((fileName) => require('./'+fileName))


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
