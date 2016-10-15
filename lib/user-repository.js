'use strict';
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();
AWS.config.update({region: 'us-east-1'});

function UserRepository(db) {
	const TABLE_NAME = 'trackerbot_users';

	this.findFromUsername = function (username) {
		const params = {
			TableName: TABLE_NAME,
			Key: {
				username
			}
		};
		return db.get(params).promise().then(response => {
			return response.Item;
		});
	};
}

module.exports = new UserRepository(db);
