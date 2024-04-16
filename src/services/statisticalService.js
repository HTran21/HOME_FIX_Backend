const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const moment = require('moment');

class StatisticalService {
    async overviewStatisticalService() {
        return new Promise(async (resolve, reject) => {
            try {
                let totalAmount = await db.DetailOrder.findAll({
                    where: {
                        paymentStatus: "P"
                    }
                    , raw: true
                })
                let totalEarning = 0;
                totalAmount.forEach(item => {
                    totalEarning += item.totalAmount;
                })

                let totalRepair = await db.Order.count({
                    where: {
                        status: {
                            [Op.ne]: 'C'
                        }
                    }
                })

                let totalUser = await db.User.count({})

                let totalCategori = await db.Categori.count({})


                resolve({ success: true, message: "Danh sách thống kê", data: { totalEarning, totalRepair, totalUser, totalCategori } })

            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async earningStatisticalService(data) {
        return new Promise(async (resolve, reject) => {
            try {

                if (data.date) {
                    const startDate = moment(data.date[0]);
                    const endDate = moment(data.date[1]);
                    let listAmount = await db.DetailOrder.findAll({
                        where: {
                            updatedAt: {
                                [Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
                            }
                        }
                    });

                    let earningTotalMap = {};

                    listAmount.forEach(item => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');
                        if (!earningTotalMap[formattedDate]) {
                            earningTotalMap[formattedDate] = item.totalAmount;
                        } else {
                            earningTotalMap[formattedDate] += item.totalAmount;
                        }
                    });

                    let earningTotal = [];

                    for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                        const formattedDate = date.format('YYYY-MM-DD');
                        if (earningTotalMap[formattedDate]) {
                            earningTotal.push({ updatedAt: formattedDate, totalAmount: earningTotalMap[formattedDate] });
                        } else {
                            earningTotal.push({ updatedAt: formattedDate, totalAmount: 0 });
                        }
                    }

                    resolve({ success: true, message: "Thống kê toàn bộ doanh thu", earningTotal });
                } else {
                    let listAmount = await db.DetailOrder.findAll({
                        where: {
                            paymentStatus: 'P'
                        }
                    });

                    const today = moment();
                    const startDate = today.clone().startOf('week');
                    const endDate = today.clone().endOf('week');
                    let earningTotalMap = {};
                    listAmount.forEach(item => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');
                        if (!earningTotalMap[formattedDate]) {
                            earningTotalMap[formattedDate] = item.totalAmount;
                        } else {
                            earningTotalMap[formattedDate] += item.totalAmount;
                        }
                    });

                    let earningTotal = [];
                    for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                        const formattedDate = date.format('YYYY-MM-DD');
                        if (earningTotalMap[formattedDate]) {
                            earningTotal.push({ updatedAt: formattedDate, totalAmount: earningTotalMap[formattedDate] });
                        } else {
                            earningTotal.push({ updatedAt: formattedDate, totalAmount: 0 });
                        }
                    }

                    resolve({ success: true, message: "Thống kê toàn bộ doanh thu", earningTotal });
                }

            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async earningStatisticalSelectService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.dateSend.data) {
                    let listAmount = await db.DetailOrder.findAll({
                        where: {
                            paymentStatus: 'P'
                        }
                    });
                    let earningTotalMap = {};
                    listAmount.forEach(item => {
                        const formattedDate = moment(item.updatedAt).format('YYYY-MM-DD');

                        if (!earningTotalMap[formattedDate]) {
                            earningTotalMap[formattedDate] = item.totalAmount;
                        } else {
                            earningTotalMap[formattedDate] += item.totalAmount;
                        }
                    });
                    if (data.dateSend.type === 'datepicker') {
                        const startDate = moment(data.dateSend.data[0]);
                        const endDate = moment(data.dateSend.data[1]);

                        let earningTotal = [];

                        for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                            const formattedDate = date.format('YYYY-MM-DD');
                            if (earningTotalMap[formattedDate]) {
                                earningTotal.push({ updatedAt: formattedDate, totalAmount: earningTotalMap[formattedDate] });
                            } else {
                                earningTotal.push({ updatedAt: formattedDate, totalAmount: 0 });
                            }
                        }

                        resolve({ success: true, message: "Thống kê toàn bộ doanh thu", earningTotal });
                    }
                    if (data.dateSend.type === 'month') {
                        const month = moment(data.dateSend.data, "YYYY-MM");
                        const daysInMonth = month.daysInMonth();
                        const firstDayOfMonth = month.startOf('month');
                        let earningTotal = [];
                        for (let i = 0; i < daysInMonth; i++) {
                            const currentDay = firstDayOfMonth.clone().add(i, 'days');
                            const formattedDate = currentDay.format('YYYY-MM-DD');
                            if (earningTotalMap[formattedDate]) {
                                earningTotal.push({ updatedAt: formattedDate, totalAmount: earningTotalMap[formattedDate] });
                            } else {
                                earningTotal.push({ updatedAt: formattedDate, totalAmount: 0 });
                            }
                        }
                        resolve({ success: true, message: "Thống kê toàn bộ doanh thu theo tháng", earningTotal });


                    }
                    if (data.dateSend.type === 'year') {
                        const year = parseInt(data.dateSend.data);
                        const monthsOfYear = [];
                        const earningTotal = [];

                        for (let month = 0; month < 12; month++) {
                            const formattedMonth = moment().year(year).month(month).startOf('month').format('YYYY-MM');
                            monthsOfYear.push(formattedMonth);
                            earningTotal.push({ updatedAt: formattedMonth, totalAmount: 0 });
                        }

                        for (const date in earningTotalMap) {
                            const monthOfYear = moment(date).format('YYYY-MM');
                            const index = monthsOfYear.indexOf(monthOfYear);
                            if (index !== -1) {
                                earningTotal[index].totalAmount += earningTotalMap[date];
                            }
                        }

                        resolve({ success: true, message: "Thống kê toàn bộ doanh thu theo năm", earningTotal });
                    }
                }
                else {
                    resolve({ success: false, message: "Vui lòng chọn thời gian" });
                }


            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async orderStatisticalService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let listOrder = await db.Order.findAll({
                    where: {
                        status: {
                            [Op.ne]: 'C'
                        }
                    }
                });
                let orderTotalMap = {};
                listOrder.forEach(item => {
                    const formattedDate = moment(item.createdAt).format('YYYY-MM-DD');

                    if (!orderTotalMap[formattedDate]) {
                        orderTotalMap[formattedDate] = {
                            count: 1
                        }
                    } else {
                        orderTotalMap[formattedDate].count++
                    }
                });
                if (data.dateSend) {
                    if (data.dateSend.type === 'datepicker') {
                        const startDate = moment(data.dateSend.data[0]);
                        const endDate = moment(data.dateSend.data[1]);

                        let orderTotal = [];

                        for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                            const formattedDate = date.format('YYYY-MM-DD');
                            if (orderTotalMap[formattedDate]) {
                                orderTotal.push({ createdAt: formattedDate, count: orderTotalMap[formattedDate].count });
                            } else {
                                orderTotal.push({ createdAt: formattedDate, count: 0 });
                            }
                        }

                        resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", orderTotal });
                    }
                    if (data.dateSend.type === 'month') {
                        const month = moment(data.dateSend.data, "YYYY-MM");
                        const daysInMonth = month.daysInMonth();
                        const firstDayOfMonth = month.startOf('month');
                        let orderTotal = [];
                        for (let i = 0; i < daysInMonth; i++) {
                            const currentDay = firstDayOfMonth.clone().add(i, 'days');
                            const formattedDate = currentDay.format('YYYY-MM-DD');
                            if (orderTotalMap[formattedDate]) {
                                orderTotal.push({ createdAt: formattedDate, count: orderTotalMap[formattedDate].count });
                            } else {
                                orderTotal.push({ createdAt: formattedDate, count: 0 });
                            }
                        }
                        resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa theo tháng", orderTotal });


                    }
                    if (data.dateSend.type === 'year') {
                        const year = parseInt(data.dateSend.data);
                        const monthsOfYear = [];
                        const orderTotal = [];

                        for (let month = 0; month < 12; month++) {
                            const formattedMonth = moment().year(year).month(month).startOf('month').format('YYYY-MM');
                            monthsOfYear.push(formattedMonth);
                            orderTotal.push({ createdAt: formattedMonth, count: 0 });
                        }

                        for (const date in orderTotalMap) {
                            const monthOfYear = moment(date).format('YYYY-MM');
                            const index = monthsOfYear.indexOf(monthOfYear);
                            if (index !== -1) {
                                orderTotal[index].count += orderTotalMap[date].count;
                            }
                        }

                        resolve({ success: true, message: "Thống kê toàn bộ đơn sủa chữa theo năm", orderTotal });
                    }

                    else {
                        resolve({ success: false, message: "Vui lòng chọn thời gian" });
                    }

                } else {
                    const today = moment();
                    const startDate = today.clone().startOf('week');
                    const endDate = today.clone().endOf('week');
                    let orderTotal = [];

                    for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                        const formattedDate = date.format('YYYY-MM-DD');
                        if (orderTotalMap[formattedDate]) {
                            orderTotal.push({ createdAt: formattedDate, count: orderTotalMap[formattedDate].count });
                        } else {
                            orderTotal.push({ createdAt: formattedDate, count: 0 });
                        }
                    }

                    resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", orderTotal });
                }


            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

}

module.exports = new StatisticalService();