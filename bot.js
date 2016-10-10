const builder = require('claudia-bot-builder')
const tokenRepository = require('./lib/TokenRepository')
const trackerBot = require('./lib/TrackerBot')

module.exports = builder(trackerBot(tokenRepository))
