'use strict'

module.exports = {
  userNotFound: (username) => {
    return "Non ho trovato nessun user associato all'username: " + username
  },
  trackerError: () => {
    return "C'è stato un problema nel contattare Toggl, verifica che il tuo token sia corretto"
  },
  trackedToday: (username) => {
      return "Ciao " + username + ". Ho tracciato la giornata di oggi."
  },
  currentProject: (project_description, project_id) => {
    return "Ciao, attualmente sto tracciando su " + project_description + " (" + project_id + ")"
  },
  help: (helps) => {
    return "Lista dei comandi disponibili su trackerbot:\n" + helps
  }
}
