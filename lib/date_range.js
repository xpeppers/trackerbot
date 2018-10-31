module.exports = function DateRange(startDate, endDate) {
  this.startDate = startDate
  this.endDate = endDate

  this.isInvalid = function () {
    return this.startDate.isAfter(this.endDate)
  }

  this.toItalianReadableString = function () {
    return "da " + startDate.locale('it').format('dddd DD MMMM') + " a " + endDate.locale('it').format('dddd DD MMMM')
  }
}
