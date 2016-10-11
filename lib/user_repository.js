const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient();

module.exports = function() {
  return new UserRepository(db)
}

function UserRepository(db) {
  this.findFromUsername = function(username) {
    params = {
      TableName: 'trackerbot_users'
      Key: {
        username: username
      }
    }
    db.get(params).promise().then(function(response) {
      return response.Item
    })
  }
}
