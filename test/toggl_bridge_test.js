'use strict'
const togglBridge = require('../lib/toggl_bridge')
const test = require('ava');

const TESTUSER_WORKSPACE_ID = '457553'
const TESTUSER_TOKEN = '7e7526d01db9b5d723e9a3e0943e4d99'

test('list available projects on toggl', t => {
  const toggl = togglBridge(TESTUSER_TOKEN)
  const response = toggl.getWorkspaceProjects(TESTUSER_WORKSPACE_ID)

  return response.then(projects => {
    const expected = [
      { name: 'Another Test Project', id: 26883667 },
      { name: 'Test Project', id: 26883634 },
    ]

    t.deepEqual(projects, expected)
  })
})

test('get last month time entries', t => {
  const toggl = togglBridge(TESTUSER_TOKEN)

  const response = toggl.getLastMonthTimeEntries()

  const expected = [
    { description: 'First activity tracked', pId: 26883634, date: new Date(2017,0,12), durationInHour: 4 },
    { description: 'First activity tracked', pId: 26883634, date: new Date(2017,0,12), durationInHour: 4 },
    { description: 'Another Project task', pId: 26883667, date: new Date(2017,0,11), durationInHour: 4 },
    { description: 'Another Project task', pId: 26883667, date: new Date(2017,0,11), durationInHour: 4 },
    { description: 'Task red', pId: 26883634, date: new Date(2017,0,10), durationInHour: 4 },
    { description: 'Issue fixed', pId: 26883667, date: new Date(2017,0,9), durationInHour: 4 },
  ]

  return response.then(entries => {
    t.deepEqual(entries, expected)
  })
})
