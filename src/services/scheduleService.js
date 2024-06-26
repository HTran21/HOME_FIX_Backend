const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { Op } = require('sequelize');
class ScheduleService {
    // async createSchedule(date) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const timeslots = [];
    //             const morningTimeslots = ['07:00-08:00', '08:30-09:30', '10:00-11:00'];
    //             const afternoonTimeslots = ['13:00-14:00', '14:30-15:30', '16:00-17:00'];

    //             morningTimeslots.forEach(slot => {
    //                 const [start, end] = slot.split('-');
    //                 const startTime = moment(date).set('hour', parseInt(start.split(':')[0])).set('minute', parseInt(start.split(':')[1]));
    //                 const endTime = moment(date).set('hour', parseInt(end.split(':')[0])).set('minute', parseInt(end.split(':')[1]));
    //                 timeslots.push({ startTime, endTime });
    //             })
    //             afternoonTimeslots.forEach(slot => {
    //                 const [start, end] = slot.split('-');
    //                 const startTime = moment(date).set('hour', parseInt(start.split(':')[0])).set('minute', parseInt(start.split(':')[1]));
    //                 const endTime = moment(date).set('hour', parseInt(end.split(':')[0])).set('minute', parseInt(end.split(':')[1]));
    //                 timeslots.push({ startTime, endTime });
    //             });

    //             resolve(timeslots);
    //         }
    //         catch (error) {
    //             reject(error);
    //         }
    //     })
    // }

    async getAllScheduleService() {
        return new Promise(async (resolve, reject) => {
            try {
                const workDays = await db.Schedule.findAll({
                    attributes: ['workDay', 'ID_Repairer'],
                    include: [
                        {
                            model: db.Repairer,
                            attributes: ['usernameRepairer'],
                        }
                    ],
                    raw: true
                });

                const scheduleMap = {};
                const uniqueWorkDays = [];

                workDays.forEach(item => {
                    const workDay = item.workDay;
                    const repairer = { ID_Repairer: item.ID_Repairer, usernameRepairer: item['Repairer.usernameRepairer'] };

                    // Nếu ngày làm việc chưa được thêm vào danh sách duy nhất, thêm vào và tạo mảng repairers
                    if (!scheduleMap[workDay]) {
                        scheduleMap[workDay] = [repairer];
                        uniqueWorkDays.push({ workDay, repairers: scheduleMap[workDay] });
                    } else {
                        // Nếu ngày làm việc đã tồn tại trong scheduleMap, chỉ cần thêm thợ vào mảng repairers tương ứng
                        scheduleMap[workDay].push(repairer);
                    }
                });
                resolve(uniqueWorkDays)

            }
            catch (error) {
                reject(error);
            }
        })
    }

    async createSchedule(id, date) {
        return new Promise(async (resolve, reject) => {
            try {
                const startDate = moment(date[0]);
                const endDate = moment(date[1]);
                const status = 'A';


                // Kiểm tra xem có trùng lịch làm việc không
                const existingSchedules = await db.Schedule.findAll({
                    where: {
                        ID_Repairer: id,
                        workDay: {
                            [Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
                        }
                    }
                });

                if (existingSchedules.length > 0) {
                    resolve({ success: false, message: "Thợ đã có lịch làm việc trong khoảng thời gian này" })
                }
                else {

                    for (let currentDate = startDate.clone(); currentDate.isSameOrBefore(endDate); currentDate.add(1, 'day')) {
                        db.Schedule.create({
                            ID_Repairer: id,
                            workDay: currentDate.format('YYYY-MM-DD'),
                            status: status
                        })
                    }
                    resolve({ success: true, message: "Tạo lịch làm việc thành công" });
                }

            }
            catch (error) {
                reject(error);
            }
        })
    }

    async listWorkDayService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let listWork = await db.Schedule.findAll({
                    where: {
                        ID_Repairer: id,
                    },
                    attributes: ['workDay'],
                    include: [
                        {
                            model: db.DetailOrder,
                            include: [{
                                model: db.Order,
                                where: {
                                    status: { [Op.notIn]: ['W', 'P', 'C'] }
                                },
                                include: {
                                    model: db.Categori,
                                    attributes: ['nameCategories']
                                }
                            }, {
                                model: db.Schedule
                            }]

                        }
                    ]
                });
                resolve(listWork)
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async getDayWorkService(ID_Repair, selectDay, ID_Service) {
        return new Promise(async (resolve, reject) => {
            const formattedSelectDay = new Date(selectDay).toISOString();

            try {
                const workDays = await db.Schedule.findAll({
                    where: {
                        workDay: {
                            [Op.eq]: formattedSelectDay
                        }
                    },
                    include: [{
                        model: db.Repairer,
                        attributes: ['usernameRepairer', 'ID_Service']
                    }]
                });

                const repairerServiceWorkDay = [];
                workDays.forEach(item => {
                    if (item.Repairer.ID_Service == ID_Service) {
                        repairerServiceWorkDay.push(item)
                    }
                })
                resolve(repairerServiceWorkDay)
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async getTimeSlotService(idSchedule) {
        return new Promise(async (resolve, reject) => {
            try {
                let listTimeSlot = await db.DetailOrder.findAll({
                    where: {
                        ID_Schedule: idSchedule
                    },
                    include: [{
                        model: db.Order,
                        where: {
                            status: 'A'
                        }
                    }],
                    attributes: ['timeRepair']
                })
                let timeSlotString = listTimeSlot.map(timeslot => timeslot.timeRepair).join(',')
                let timeSlotArray = timeSlotString.split(',')
                resolve(timeSlotArray)
            }
            catch (error) {
                reject(error);
            }

        })
    }

    async getWorkRepairerService(id, currentDate) {
        return new Promise(async (resolve, reject) => {
            try {
                if (currentDate) {
                    const formattedCurrentDate = new Date(currentDate).toISOString();
                    let listWork = await db.Schedule.findOne({
                        where: {
                            ID_Repairer: id,
                            workDay: {
                                [Op.eq]: formattedCurrentDate
                            }
                        },
                        // attributes: ['workDay'],
                        include: {
                            model: db.DetailOrder,

                            include: {
                                model: db.Order,
                                include: {
                                    model: db.Categori,
                                    attributes: ['nameCategories']
                                }
                            }

                        }
                    })
                    if (listWork) {
                        resolve({ success: true, message: "Danh sách sửa chữa", listWork })
                    } else {
                        resolve({ success: false, message: "Danh sách sửa chữa rỗng" })
                    }
                }
                else {
                    // let listWork = await db.Schedule.findAll({
                    //     where: {
                    //         ID_Repairer: id,
                    //     },
                    //     // attributes: ['workDay'],
                    //     include: {
                    //         model: db.DetailOrder,
                    //         include: {
                    //             model: db.Order,
                    //             include: {
                    //                 model: db.Categori,
                    //                 attributes: ['nameCategories']
                    //             }
                    //         }

                    //     }
                    // })
                    let listWork = await db.DetailOrder.findAll({
                        include: [{
                            model: db.Schedule,
                            where: {
                                ID_Repairer: id
                            }

                        }, {
                            model: db.Order,
                            where: {
                                status: 'P'
                            },
                            include: [{
                                model: db.Categori
                            }]
                        }]
                    })
                    resolve(listWork)
                }

            }
            catch (error) {
                reject(error);
            }

        })
    }

    async getTotalOrderDayService(ID_Schedule) {
        return new Promise(async (resolve, reject) => {
            try {
                let existSchedules = await db.Schedule.findByPk(ID_Schedule)
                if (existSchedules) {
                    let totalOrderDay = await db.DetailOrder.count({
                        where: {
                            ID_Schedule: ID_Schedule,
                        },
                        include: [{
                            model: db.Order,
                            where: {
                                status: { [Op.notIn]: ['W', 'C'] }
                            }
                        }]
                    })
                    resolve({ success: true, message: "Tông công việc một ngày của thợ", totalOrderDay })
                } else {
                    resolve({ success: false, message: "Không tìm thấy lịch làm việc" })
                }
            }
            catch (error) {
                reject(error);
            }

        })
    }

    async deleteScheduleService(ID_Repairer, dateDelete) {
        return new Promise(async (resolve, reject) => {
            try {
                let dateFormat = new Date(dateDelete);
                let existSchedule = await db.Schedule.findOne({
                    where: {
                        ID_Repairer: ID_Repairer,
                        workDay: dateFormat
                    }
                })
                if (existSchedule) {
                    let ID_Schedule = existSchedule.id;
                    await db.Schedule.destroy({
                        where: {
                            id: ID_Schedule
                        }
                    })
                    resolve({ success: true, message: "Đã xóa lịch làm việc thành công" })
                } else {
                    resolve({ success: false, message: "Không tìm thấy lịch làm việc" })
                }
            }
            catch (error) {
                reject(error);
            }

        })
    }



}

module.exports = new ScheduleService();