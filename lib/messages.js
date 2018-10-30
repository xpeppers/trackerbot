'use strict'

module.exports = {
  userNotFound: (username) => {
    return "Non ho trovato nessun user associato all'username: " + username
  },
  trackerError: () => {
    return "C'è stato un problema nel contattare Toggl, verifica che il tuo token sia corretto"
  },
  trackedDate: (username, date, project) => {
    return "Ciao " + username + ". Ho tracciato la giornata di " + date.locale('it').format('dddd DD MMMM') +
      " sul progetto " + project.description + " (" + project.id + ")."
  },
  trackedDateRange(username, dateRange, skippedDates, project) {
    const startDate = dateRange.startDate
    const endDate = dateRange.endDate

    if (startDate == endDate)
      return this.trackedDate(username, startDate, project)

    return "Ciao " + username + ". Ho tracciato le giornate da " +
      startDate.locale('it').format('dddd DD MMMM') +
      " a " +
      endDate.locale('it').format('dddd DD MMMM') + skippedDatesText(skippedDates) +
      " sul progetto " + project.description + " (" + project.id + ")."
  },
  trackedDateRangeError: (username, dateRange) => {
    const startDate = dateRange.startDate
    const endDate = dateRange.endDate

    return "Hey " + username + " :) Ho provato a tracciare le date da " +
      startDate.locale('it').format('dddd DD MMMM') +
      " a " +
      endDate.locale('it').format('dddd DD MMMM') + ", ma si è verificato un problema contattando toggl, per favore controlla manualmente la dashboard " +
      "o usa `/t log` per vedere cosa ho tracciato"
  },
  wrongDateRange: () => {
    return 'Il range specificato non è un range valido.'
  },
  trackedEntriesLog: (entries) => {
    return 'Hai recentemente tracciato:\n' + entries.map(formatEntry).join("\n")
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
    return "Lista dei comandi disponibili su Trackerbot:\n" + helps
  },
  projectsList: (projects) => {
    var result = 'Ecco i progetti disponibili:'
    projects.forEach(function (p) {
      result += "\n* " + p.name + " (" + p.id + ")"
    })
    return result
  }
}

function formatEntry(entry) {
  const moment = require('moment-timezone')
  return "- "
    + moment(entry.date).tz("Europe/Rome").locale('it').format('dddd DD MMMM') + " "
    + entry.durationInHour + "h " + "sul progetto " + entry.description + " (" + entry.pId + ")."
}

function skippedDatesText(skippedDates) {
  if (skippedDates.length == 0)
    return ""

  return " (tralasciando "
    + skippedDates.map(date => date.locale('it').format('dddd DD')).join(", ") + ")"
}
