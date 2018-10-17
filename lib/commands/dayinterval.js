const clock = require('../clock')
const DateRange = require('../date_range')

const trackHelper = require('../track_helper')

const REGEX = "^([0-9]{1,2})\-([0-9]{1,2})$"

function DayIntervalCommand() {

  this.handleRequest = (request) => {
    return request.text.match(new RegExp(REGEX))
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    const startDayOfMonth = extractStartDayOfMonthFrom(request)
    const endDayOfMonth = extractEndDayOfMonthFrom(request)
    const startDate = pastDateFor(startDayOfMonth)
    const endDate = pastDateFor(endDayOfMonth)
    const dateRange = new DateRange(startDate,endDate)

    return trackHelper.trackDateRange(username, dateRange)
  }

  this.help = () => {
    return ["<start day>-<end day> - Traccia l'intervallo di giorni specificato nel mese più vicino al passato."]
  }

  function extractStartDayOfMonthFrom(request) {
    return new RegExp(REGEX).exec(request.text)[1]
  }

  function extractEndDayOfMonthFrom(request) {
    return new RegExp(REGEX).exec(request.text)[2]
  }

  function pastDateFor(targetDayOfMonth) {
    const today = clock.today()
    var pastDate = today.clone()

    if(targetDayOfMonth > today.date())
      pastDate = pastDate.subtract(1, 'months')
      
    pastDate.date(targetDayOfMonth)
    return pastDate
  }

}

module.exports = new DayIntervalCommand()
