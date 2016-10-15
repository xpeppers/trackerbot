'use strict';
const test = require('ava');
const TODAY = require('moment')();
const tracker = require('../lib/tracker');

const TEST_TOKEN = '9b07c50c5126baf8c2d263b3dbfde3ee';

test.skip('track today', t => {
  return tracker(TEST_TOKEN).trackDate(TODAY, 'phoenix')
  .then(entries => {
    t.truthy(entries.length === 2);
    t.truthy(entries[1].description === 'Phoenix');
    t.truthy(entries[0].description === 'Phoenix');
  });
});

test('throw exception on not existent token', t => {
  return tracker('not_existent_token').trackDate(TODAY, 'phoenix')
  .catch(err => {
    t.truthy(err !== undefined);
  });
});
