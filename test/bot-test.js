'use strict';
const assert = require('assert');
const bot = require('../lib');
const requestBuilder = require('./request-builder');

const USER_WITH_TEST_TOGGL_TOKEN = 'toggltoken';
const TEST_USER = 'testuser';

describe('Bot', function () {
	this.timeout(5000);

	it.skip('returns message ok on track today command', () => {
		const request = requestBuilder().withText('today').withUserName(USER_WITH_TEST_TOGGL_TOKEN);
		const response = bot(request);

		return response.then(res => {
			assert.equal('Ciao ' + USER_WITH_TEST_TOGGL_TOKEN + '. Ho tracciato la giornata di oggi.', res);
		});
	});

	it('returns error message if token is not found ', () => {
		const request = requestBuilder().withText('today').withUserName('not_existent_user');
		const response = bot(request);

		return response.then(res => {
			assert.equal('Non ho trovato nessun user associato all\'username: not_existent_user', res);
		});
	});

	it('return project name for project command', () => {
		const request = requestBuilder().withText('project').withUserName(TEST_USER);
		const response = bot(request);

		return response.then(res => {
			assert.equal('Ciao, attualmente sto tracciando su: test_project', res);
		});
	});

	it('return project name for project command', () => {
		const request = requestBuilder().withText('project').withUserName('not_existent_user');
		const response = bot(request);

		return response.then(res => {
			assert.equal('Non ho trovato nessun user associato all\'username: not_existent_user', res);
		});
	});

	it('returns help for no arguments', () => {
		const request = requestBuilder().withText('');
		const response = bot(request);

		assert.ok(response.includes('today - '));
		assert.ok(response.includes('project - '));
	});
});
