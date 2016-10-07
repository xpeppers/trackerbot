const builder = require('claudia-bot-builder')

module.exports = builder(function (request) {
    return 'Thanks for sending ' + request.text + 'Your message is very important to us, but '
});

