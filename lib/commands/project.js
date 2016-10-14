'use strict';
const userRepository = require('../user-repository');
const messages = require('../messages');

function ProjectCommand() {
	this.handleRequest = request => {
		return request.text === 'project';
	};

	this.execute = request => {
		const username = request.originalRequest.user_name;
		return userRepository.findFromUsername(username).then(user => {
			if (undefined === user) {
				return messages.userNotFound(username);
			}
			return messages.currentProject(user.project);
		});
	};

	this.help = () => {
		return ['project - returns current project'];
	};
}

module.exports = new ProjectCommand();
