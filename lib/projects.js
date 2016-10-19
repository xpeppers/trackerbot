const projects = [
  new Project(8107914, 'phoenix'),
  new Project(8107341, 'attività interne'),
  new Project(000000, 'cdc')
]

module.exports = function(name) {
  project = projects.find((project) => {
    return project.name == name
  })
  return project
}

function Project(id, name) {
  this.id = id
  this.name = name
}

