const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const moment = require('moment');
class ScheduleService {
    async createSchedule(date) {
        return new Promise(async (resolve, reject) => {
            try {
                const timeslots = [];
                const morningTimeslots = ['07:00-08:00', '08:30-09:30', '10:00-11:00'];
                const afternoonTimeslots = ['13:00-14:00', '14:30-15:30', '16:00-17:00'];

                morningTimeslots.forEach(slot => {
                    const [start, end] = slot.split('-');
                    const startTime = moment(date).set('hour', parseInt(start.split(':')[0])).set('minute', parseInt(start.split(':')[1]));
                    const endTime = moment(date).set('hour', parseInt(end.split(':')[0])).set('minute', parseInt(end.split(':')[1]));
                    timeslots.push({ startTime, endTime });
                })
                afternoonTimeslots.forEach(slot => {
                    const [start, end] = slot.split('-');
                    const startTime = moment(date).set('hour', parseInt(start.split(':')[0])).set('minute', parseInt(start.split(':')[1]));
                    const endTime = moment(date).set('hour', parseInt(end.split(':')[0])).set('minute', parseInt(end.split(':')[1]));
                    timeslots.push({ startTime, endTime });
                });

                resolve(timeslots);
            }
            catch (error) {
                reject(error);
            }
        })
    }


}

module.exports = new ScheduleService();