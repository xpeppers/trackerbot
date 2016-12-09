'use strict'
const moment = require('moment-timezone')

function Clock() {

  this.today = function() {
    return moment().tz('Europe/Rome')
  }

}

module.exports = new Clock()
