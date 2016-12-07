'use strict'
const moment = require('moment-timezone')

function Clock() {

  this.today = function() {
    return moment()
  }

}

module.exports = new Clock()
