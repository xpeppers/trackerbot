const builder = require('claudia-bot-builder')
const TokenRepository = require('./lib/TokenRepository')
const tokenRepository = new TokenRepository()
const TrackerBot = require('./lib/TrackerBot')

module.exports = builder(new TrackerBot(tokenRepository))

