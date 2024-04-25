const db = require('../app/models/index')
const multer = require('multer');
const scheduleService = require("../services/scheduleService");
const storage = require("../middleware/upload_image");
const moment = require('moment');
class ScheduleController {
    // async createSchedudle(req, res, next) {
    //     const startDate = moment('2024-04-02');
    //     const endDate = moment('2024-04-05');
    //     const allTimeslots = [];
    //     for (let currentDate = startDate.clone(); currentDate.isSameOrBefore(endDate); currentDate.add(1, 'day')) {
    //         const timeslotsForDay = await scheduleService.createSchedule(currentDate);
    //         allTimeslots.push({ date: currentDate.clone(), timeslots: timeslotsForDay });
    //     }
    //     allTimeslots.forEach(day => {
    //         console.log(`Ngày ${day.date.format('DD/MM/YYYY')}:`);
    //         day.timeslots.forEach(slot => {
    //             console.log(`- ${slot.startTime.format('HH:mm')} - ${slot.endTime.format('HH:mm')}`);
    //         });
    //     });
    // }

    async getAllSchedule(req, res, next) {
        try {
            let data = await scheduleService.getAllScheduleService();
            return res.json(data)
        }
        catch (e) {
            console.log(e)
        }
    }

    async createSchedule(req, res, next) {
        try {
            const date = req.body.date;
            const id = req.body.id;
            let data = await scheduleService.createSchedule(id, date);
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            return res.json({ e })
        }
    }

    async listWorkDay(req, res, next) {
        try {
            const id = req.params.id;
            let data = await scheduleService.listWorkDayService(id);
            return res.json({ data });
        } catch (e) {
            console.log(e);
            return res.json({ e })
        }
    }

    async getDayWorkService(req, res, next) {
        try {
            const ID_Repair = req.params.id;
            // const selectDay = req.query.selectDay;
            const selectDay = (moment(req.query.selectDay).format('YYYY-MM-DD'))
            // console.log(selectDay)
            const ID_Service = req.query.idService;
            // console.log("selectDay", moment(selectDay).format('YYYY-MM-DD'))

            let data = await scheduleService.getDayWorkService(ID_Repair, selectDay, ID_Service);
            return res.json(data)

        }
        catch (e) {
            console.log(e);
            return res.json({ e })
        }
    }

    async getTimeSlot(req, res, next) {
        try {
            const idSchedule = req.params.id;
            let data = await scheduleService.getTimeSlotService(idSchedule);
            return res.json(data);

        } catch (e) {
            console.log(e);
            return res.json({ e })
        }
    }

    async getWorkRepairer(req, res, next) {
        try {
            const id = req.params.id;
            const currentDate = req.query.currentDate;
            let data = await scheduleService.getWorkRepairerService(id, currentDate);
            return res.json(data)
        }
        catch (e) {
            console.log(e);
            return res.json(e)
        }
    }

    async getTotalOrderDay(req, res, next) {
        try {
            const ID_Schedule = req.params.id
            let data = await scheduleService.getTotalOrderDayService(ID_Schedule)
            return res.json(data)
        }
        catch (e) {
            console.log(e);
            return res.json(e)
        }
    }


}

module.exports = new ScheduleController();