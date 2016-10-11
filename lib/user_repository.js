const AWS = require('aws-sdk')
AWS.config.update({endpoint: "https://dynamodb.us-east-1.amazonaws.com"});
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'trackerbot_users'

function UserRepository(db) {

  this.findFromUsername = function(username, callback) {
    params = {
      TableName: TABLE_NAME,
      Key: {
        username: username
      }
    }
    return db.get(params).promise().then(function(response) {
      return response.Item
    })
  }
}

module.exports = new UserRepository(db)
