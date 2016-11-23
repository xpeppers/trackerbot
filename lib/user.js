module.exports = function User(username, token, project_id, project_description) {
  this.username = username
  this.token = token
  this.project = {
    id: project_id,
    description: project_description,
  }
}

