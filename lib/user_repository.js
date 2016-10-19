'use strict'
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'});
const db = new AWS.DynamoDB.DocumentClient();

function UserRepository(db) {
  const TABLE_NAME = 'trackerbot_users'

  this.findFromUsername = function(username, callback) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        username: username
      }
    }
    return db.get(params).promise().then(function(response) {
      return response.Item
    })
  }

  this.save = function(user) {
    const params = {
      TableName: TABLE_NAME,
      Item: user
    };
    return db.put(params).promise()
  }
}

module.exports = new UserRepository(db)
