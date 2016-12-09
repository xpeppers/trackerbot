const clock = require('../clock')
const trackHelper = require('../track_helper')

function TodayCommand() {

  this.handleRequest = (request) => {
    return request.text == 'today'
  }

  this.execute = (request) => {
    const username = request.originalRequest.user_name
    const targetDate = clock.today()

    return trackHelper.trackDate(username, targetDate)
  }

  this.help = () => {
    return ["today - Traccia la giornata di oggi sul progetto di default"]
  }

}

module.exports = new TodayCommand()
