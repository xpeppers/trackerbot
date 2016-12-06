'use strict'

module.exports = {
  userNotFound: (username) => {
    return "Non ho trovato nessun user associato all'username: " + username
  },
  trackerError: () => {
    return "C'è stato un problema nel contattare Toggl, verifica che il tuo token sia corretto"
  },
  trackedDate: (username, date) => {
      return "Ciao " + username + ". Ho tracciato la giornata " + date.format('dddd, MMMM Do YYYY') + "."
  },
  userWithoutSetProject: () => {
      return "Non so su che progetto tracciare te. Imposta prima il progetto."
  },
  currentProject: (project) => {
    return "Ciao, attualmente sto tracciando su " + project.description + " (" + project.id + ")"
  },
  projectSet: (project) => {
    return "Ho impostato " + project.description + " (" + project.id + ") come progetto"
  },
  tokenSaved: (username) => {
      return "Ottimo, ora sono in grado di tracciare per te"
  },
  help: (helps) => {
    return "Lista dei comandi disponibili su trackerbot:\n" + helps
  }
}
