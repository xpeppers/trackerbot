const projects = [
  new Project(8107914, 'phoenix'),
  new Project(8107341, 'attività interne'),
  new Project(000000, 'cdc')
]

module.exports = function(name) {
  return projects.find((project) => {
    return project.description == name
  })
}

function Project(id, description) {
  this.id = id
  this.description = description
}

