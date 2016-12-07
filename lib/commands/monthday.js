const clock = require('../clock')
const trackHelper = require('../track_helper')

const REGEX = /^([0-9]{1,2})$/g

function MonthDayCommand() {

  this.handleRequest = (request) => {
    return request.text.match(REGEX)
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    const targetDayOfMonth = extractDayOfMonthFrom(request)
    const today = clock.today().tz('Europe/Rome')
    const targetDate = today.clone().date(targetDayOfMonth)
    if (targetDate > today)
      targetDate = targetDate.subtract(1, 'months')

    return trackHelper.trackDate(username, targetDate)
  }

  this.help = () => {
    return ["<day of month> - Traccia il giorno del mese più vicino nel passato."]
  }

  function extractDayOfMonthFrom(request) {
    return REGEX.exec(request.text)[1]
  }

}

module.exports = new MonthDayCommand()
