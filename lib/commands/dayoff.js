const clock = require('../clock')
const trackHelper = require('../track_helper')

const REGEX = "ferie ([0-9]{1,2})$"

function FerieCommand() {

  this.handleRequest = (request) => {
    return request.text.match(new RegExp(REGEX))
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    const targetDayOfMonth = extractDayOfMonthFrom(request)
    const pastDate = calculatePastDateFor(targetDayOfMonth)
    return trackHelper.trackDayOff(username, pastDate)
  }

  this.help = () => {
    return ["<day of month> - Traccia il giorno del mese più vicino nel passato sul progetto Ferie."]
  }

  function extractDayOfMonthFrom(request) {
    return new RegExp(REGEX).exec(request.text)[1]
  }

  function calculatePastDateFor(targetDayOfMonth) {
    const today = clock.today()
    var pastDate = today.clone()

    if (targetDayOfMonth > today.date())
      pastDate = pastDate.subtract(1, 'months')

    pastDate.date(targetDayOfMonth)
    return pastDate
  }

}

module.exports = new FerieCommand()
