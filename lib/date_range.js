module.exports = function DateRange(startDate, endDate) {
  this.startDate = startDate
  this.endDate = endDate

  this.isInvalid = function () {
    return this.startDate.isAfter(this.endDate)
  }

  this.isAWeekend = function () {
    const currentDate = startDate.clone()
    while (currentDate.isSameOrBefore(endDate)) {
      if (isWorkday(currentDate)) {
        return false;
      }
      currentDate.add(1, 'days')
    }
    return true
  }

  this.toItalianReadableString = function () {
    return "da " + startDate.locale('it').format('dddd DD MMMM') + " a " + endDate.locale('it').format('dddd DD MMMM')
  }
}

function isWorkday(day) {
  return day.isoWeekday() < 6
}