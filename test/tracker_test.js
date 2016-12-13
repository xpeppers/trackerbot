'use strict'
const tracker = require('../lib/tracker')
const test = require('ava');

const TESTUSER_WORKSPACE_ID = '457553'
const TESTUSER_TOKEN = '7e7526d01db9b5d723e9a3e0943e4d99'

test('list available projects on toggl', t => {
  const toggl = tracker(TESTUSER_TOKEN)
  const response = toggl.getWorkspaceProjects(TESTUSER_WORKSPACE_ID)

  return response.then(projects => {
    const expected = [
      { name: 'Another Test Project', id: 26883667 },
      { name: 'Test Project', id: 26883634 },
    ]

    t.deepEqual(projects, expected)
  })
})
