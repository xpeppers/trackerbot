'use strict'
const test = require('ava');

/** this data could change online, check on toggl.com with this credentials:
    - "test.user@toggl.com"
    - "StrongPassword"
**/
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
  const toggl = togglBridgeWithTodayDate(TESTUSER_TOKEN, '2017-01-20')

  const response = toggl.getLastMonthTimeEntries()

  const expected = [
    { description: 'First activity tracked', pId: 26883634, date: "2017-01-12", durationInHour: 4 },
    { description: 'First activity tracked', pId: 26883634, date: "2017-01-12", durationInHour: 4 },
    { description: 'Another Project task', pId: 26883667, date: "2017-01-11", durationInHour: 4 },
    { description: 'Another Project task', pId: 26883667, date: "2017-01-11", durationInHour: 4 },
    { description: 'Task red', pId: 26883634, date: "2017-01-10", durationInHour: 4 },
    { description: 'Issue fixed', pId: 26883667, date: "2017-01-09", durationInHour: 4 },
  ]

  return response.then(entries => {
    t.deepEqual(entries, expected)
  })
})

function togglBridge(togglToken) {
  const togglBridge = require('../lib/toggl_bridge')
  return togglBridge(togglToken)
}

function togglBridgeWithTodayDate(togglToken, todayDate) {
  const momentStub = function(stringToParse) {
    stringToParse = stringToParse || todayDate
    return require('moment-timezone')(stringToParse).tz('America/New_York')
  }

  momentStub['@global'] = true
  const proxyquire = require('proxyquire')
  const togglBridge = proxyquire('../lib/toggl_bridge', {
    'moment-timezone': momentStub
  })

  return togglBridge(togglToken)
}
