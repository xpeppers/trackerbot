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
  userWithoutSetProject: () => {
      return "Non so su che progetto tracciare te. Imposta prima il progetto."
  },
  currentProject: (project) => {
    return "Ciao, attualmente sto tracciando su " + project.description + " (" + project.id + ")"
  },
  tokenSaved: (username) => {
      return "Ottimo, ora sono in grado di tracciare per te"
  },
  help: (helps) => {
    return "Lista dei comandi disponibili su trackerbot:\n" + helps
  }
}
