const builder = require('claudia-bot-builder')
const trackerBot = require('./lib/TrackerBot')

module.exports = builder(trackerBot)
