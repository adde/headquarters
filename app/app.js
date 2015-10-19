/**
 * Dependencies
 */
var schedule = require('node-schedule');
var SunCalc = require('suncalc');
var request = require('request');
var config = require('./config');
var helpers = require('./helpers');

var app = function() {

  this.init = function() {
    var sunset = this.getCurrentSunset();
    this.setupScheduledTasks(sunset);
  };

  /**
   * Get current sunset
   */
  this.getCurrentSunset = function() {
    var times = SunCalc.getTimes(new Date(), config.latitude, config.longitude);
    var hours = times.sunset.getHours();
    var minutes = times.sunset.getMinutes();
    return { hours: hours, minutes: minutes };
  };

  /**
   * Set up scheduled tasks
   */
  this.setupScheduledTasks = function(sunset) {
    var on = schedule.scheduleJob(sunset.minutes + ' ' + sunset.hours + ' * * *', function() {
      request.post(config.server + config.commands.on, { form: { action: '' } }, function (error, response, body) {
        var time = new Date();
        console.log(helpers.addZero(time.getHours()) + ':' + helpers.addZero(time.getMinutes()) + ' - Lights on!');
      });
    });
    console.log('Scheduled job will turn lights ON at: ' + helpers.addZero(sunset.hours) + ':' + helpers.addZero(sunset.minutes));

    var off = schedule.scheduleJob(config.lightsOff.minutes + ' ' + config.lightsOff.hours + ' * * *', function() {
      request.post(config.server + config.commands.off, { form: { action: '' } }, function (error, response, body) {
        var time = new Date();
        console.log(helpers.addZero(time.getHours()) + ':' + helpers.addZero(time.getMinutes()) + ' - Lights off!');
      });
    });
    console.log('Scheduled job will turn lights OFF at: ' + config.lightsOff.hours + ':' + config.lightsOff.minutes);
  };

};

module.exports = app;










