const botBuilder = require('claudia-bot-builder');
const TrackerBot = require('./lib/bot')
const UserRepository = require('./user_repository')
const TogglTracker = require('./tracker')

module.exports = botBuilder(function (request) {
  bot = new TrackerBot(
    new UserRepository(),
    new TogglTracker(new TogglApiFactory())
  )

  return bot.serve(request)
})
