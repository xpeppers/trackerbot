const clock = require('../clock')
const DateRange = require('../date_range')

const trackHelper = require('../track_helper')

const REGEX = "ferie ([0-9]{1,2})\-([0-9]{1,2})$"

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
    const dateRange = new DateRange(startDate, endDate)

    const DEFAULT_HOLIDAY_PROJECT = {
      id: "8352044",
      description: "Ferie",
      tags: ["Ferie"]
    }

    return trackHelper.trackDateRange(username, dateRange, DEFAULT_HOLIDAY_PROJECT)
  }

  this.help = () => {
    return ["<start day>-<end day> - Traccia l'intervallo di giorni specificato nel mese più vicino al passato sul progetto Assenza con tag Ferie."]
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

    if (targetDayOfMonth > today.date())
      pastDate = pastDate.subtract(1, 'months')

    pastDate.date(targetDayOfMonth)
    return pastDate
  }

}

module.exports = new DayIntervalCommand()
