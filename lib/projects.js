'use strict';
const projects = [
	new Project(8107914, 'phoenix'),
	new Project(8107341, 'attività interne')
];

module.exports = function (name) {
	const project = projects.find(project => {
		return project.name === name;
	});
	return project;
};

function Project(id, name) {
	this.id = id;
	this.name = name;
}

