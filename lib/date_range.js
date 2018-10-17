module.exports = function DateRange(startDate, endDate) {
  this.startDate = startDate
  this.endDate = endDate

  this.isInvalid = function(){
    return this.startDate > this.endDate
  }
}
