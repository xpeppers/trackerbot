module.exports = function() {
  var request =  {
    "sender":"SENDER_ID",
    "text":"prova",
    "originalRequest":{
      "token":"TOKEN_ID",
      "team_id":"T024J9QH0",
      "team_domain":"xpeppers",
      "channel_id":"D02HRMAPF",
      "channel_name":"directmessage",
      "user_id":"SENDER_ID",
      "user_name":"ettoredelprino",
      "command":"/track",
      "text":"prova",
      "response_url":"https://hooks.slack.com/commands/T024J9QH0/88688115858/poPJLtcJvydwpzahL9hankv7"
    },
    "type":"slack-slash-command"
  }

  request.withText = function(text) {
    request.originalRequest.text = text
    request.text = text
    return this
  }

  request.withUserName = function(userName) {
    request.originalRequest.user_name = userName
    return this
  }

  return request
}
