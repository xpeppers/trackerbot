const commands = [
  require('./today'),
  require('./project')
]

module.exports = (request) => {
  command = commands.find((command) => {
    return command.handleRequest(request)
  })

  if (undefined == command) {
    return commands.map((command) => {
      return command.help().join('\n')
    }).join('\n')
  }
  return command.execute(request)
}
