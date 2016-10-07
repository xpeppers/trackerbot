module.exports = function() {
  var tokens = {
    "ettoredelprino": "TokeTogglData"
  }

  this.findFromUsername = function(username) {
    return tokens[username]
  }
}
