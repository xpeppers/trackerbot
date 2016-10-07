const builder = require('claudia-bot-builder')

const TokenRepository = require('./lib/TokenRepository')
const repository = new TokenRepository()

module.exports = builder(function(request) {
  return "Ciao " + request.originalRequest.user_name + ". Il tuo token è " + repository.findFromUsername(request.originalRequest.user_name)
});

