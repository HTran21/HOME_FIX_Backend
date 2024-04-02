const db = require('../app/models/index')
const multer = require('multer');
const scheduleService = require("../services/scheduleService");
const storage = require("../middleware/upload_image");
const moment = require('moment');
class ScheduleController {
    async createSchedudle(req, res, next) {
        // const id = req.body.id;
        // const date = req.body.date;
        const startDate = moment('2024-04-02');
        const endDate = moment('2024-04-05');
        const allTimeslots = [];
        for (let date = startDate; date.isSameOrBefore(endDate); date.add(1, 'day')) {
            const timeslotsForDay = await scheduleService.createSchedule(date);
            allTimeslots.push({ date, timeslots: timeslotsForDay });
        }
        allTimeslots.forEach(day => {
            console.log(`Ngày ${day.date.format('DD/MM/YYYY')}:`);
            day.timeslots.forEach(slot => {
                console.log(`- ${slot.startTime.format('HH:mm')} - ${slot.endTime.format('HH:mm')}`);
            });
        });
    }


}

module.exports = new ScheduleController();