const commands = [
  require('./today'),
  require('./project')
]

module.exports = (request) => {
  command = commands.find((command) => {
    return command.handleRequest(request)
  })

  if (undefined == command) {
    return ''
  }
  return command.execute(request)
}
