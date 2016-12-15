'use strict'
const TogglApi = require('toggl-api')

module.exports = function(token) {
  return new TogglBridge(token)
}

function TogglBridge(token) {
  var toggl = new TogglApi({ apiToken: token })

  this.createTimeEntry = function(entry) {
    return new Promise((resolve, reject) => {
      toggl.createTimeEntry(entry, (err, data) => {
        (err) ? reject(err) : resolve(data)
      })
    })
  }

  this.getWorkspaceProjects = function(workspaceId, options) {
    options = options || { active: true }
    return new Promise((resolve, reject) => {
      toggl.getWorkspaceProjects(workspaceId, options, (err, data) => {
        (err) ? reject(err) : resolve(data.map(adaptProject))
      })
    })
  }

  function adaptProject(project) {
    return {
      id: project.id,
      name: project.name
    }
  }

}

