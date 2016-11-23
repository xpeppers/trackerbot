'use strict'
const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'});
const db = new AWS.DynamoDB.DocumentClient();
const User = require('./user')

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
      return buildFromDB(response.Item)
    })
  }

  this.save = function(user) {
    const params = {
      TableName: TABLE_NAME,
      Item: prepareForSave(user)
    };
    return db.put(params).promise()
  }

  function prepareForSave(user) {
    return {
      username: user.username,
      token: user.token,
      project_description: user.project.description,
      project_id: user.project.id,
    }
  }

  function buildFromDB(user) {
    if(user == null || user == undefined)
      return user

    return new User(
      user.username,
      user.token,
      parseInt(user.project_id),
      user.project_description
    )
  }
}

module.exports = new UserRepository(db)
