module.exports = new function() {
  var tokens = {
    "ettoredelprino": "TokenTogglData"
  }

  this.findFromUsername = function(username) {
    return tokens[username]
  }
}
