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


    async earningStatisticalSelectService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let listAmount = await db.DetailOrder.findAll({
                    where: {
                        paymentStatus: 'P'
                    },
                    include: [{
                        model: db.Schedule
                    }, {
                        model: db.Order,
                        include: [{
                            model: db.Categori
                        }]
                    }]
                });
                let earningTotalMap = {};
                listAmount.forEach(item => {
                    const formattedDate = moment(item.Schedule.workDay).format('YYYY-MM-DD');

                    if (!earningTotalMap[formattedDate]) {
                        earningTotalMap[formattedDate] = item.totalAmount;
                    } else {
                        earningTotalMap[formattedDate] += item.totalAmount;
                    }
                });
                let listService = await db.Service.findAll();
                if (data.dateSend) {
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

                        let listAmountByDay = await db.DetailOrder.findAll({
                            where: {
                                paymentStatus: 'P'
                            },
                            include: [{
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startDate, endDate]
                                    }
                                }
                            }, {
                                model: db.Order,
                                include: [{
                                    model: db.Categori
                                }]
                            }]
                        });

                        let listAmountByService = listService.map(item => {
                            let idService = item.id;
                            let orderByService = listAmountByDay.filter(order => order.Order.Categori.ID_Service === idService);
                            let totalAmountService = orderByService.reduce((total, order) => total + order.totalAmount, 0);
                            return {
                                service: item,
                                orders: orderByService,
                                totalAmount: totalAmountService
                            };
                        })

                        let totalAmount = listAmountByService.reduce((total, amount) => total + amount.totalAmount, 0)

                        resolve({ success: true, message: "Thống kê toàn bộ doanh thu theo ngày", earningTotal, listAmountByService, totalAmount });
                    }
                    if (data.dateSend.type === 'month') {
                        const month = moment(data.dateSend.data, "YYYY-MM");
                        const daysInMonth = month.daysInMonth();
                        const firstDayOfMonth = month.startOf('month');
                        const endDayOfMonth = month.clone().endOf('month');
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
                        let listAmountByDay = await db.DetailOrder.findAll({
                            where: {
                                paymentStatus: 'P'
                            },
                            include: [{
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [firstDayOfMonth, endDayOfMonth]
                                    }
                                }
                            }, {
                                model: db.Order,
                                include: [{
                                    model: db.Categori
                                }]
                            }]
                        });

                        let listAmountByService = listService.map(item => {
                            let idService = item.id;
                            let orderByService = listAmountByDay.filter(order => order.Order.Categori.ID_Service === idService);
                            let totalAmountService = orderByService.reduce((total, order) => total + order.totalAmount, 0);
                            return {
                                service: item,
                                orders: orderByService,
                                totalAmount: totalAmountService
                            };
                        })

                        let totalAmount = listAmountByService.reduce((total, amount) => total + amount.totalAmount, 0)
                        resolve({ success: true, message: "Thống kê toàn bộ doanh thu theo tháng", earningTotal, listAmountByService, totalAmount });


                    }
                    if (data.dateSend.type === 'year') {
                        const year = parseInt(data.dateSend.data);
                        const startOfYear = moment(year, "YYYY").startOf('year');
                        const endOfYear = moment(year, "YYYY").endOf('year');
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

                        let listAmountByDay = await db.DetailOrder.findAll({
                            where: {
                                paymentStatus: 'P'
                            },
                            include: [{
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startOfYear, endOfYear]
                                    }
                                }
                            }, {
                                model: db.Order,
                                include: [{
                                    model: db.Categori
                                }]
                            }]
                        });

                        let listAmountByService = listService.map(item => {
                            let idService = item.id;
                            let orderByService = listAmountByDay.filter(order => order.Order.Categori.ID_Service === idService);
                            let totalAmountService = orderByService.reduce((total, order) => total + order.totalAmount, 0);
                            return {
                                service: item,
                                orders: orderByService,
                                totalAmount: totalAmountService
                            };
                        })

                        let totalAmount = listAmountByService.reduce((total, amount) => total + amount.totalAmount, 0)
                        resolve({ success: true, message: "Thống kê toàn bộ doanh thu theo năm", earningTotal, listAmountByService, totalAmount });
                    }
                }
                else {
                    // const today = moment();
                    // const startDate = today.clone().startOf('week');
                    // const endDate = today.clone().endOf('week');
                    const today = moment();
                    const startDate = today.clone().subtract(6, 'days').startOf('day');
                    const endDate = today.clone().endOf('day');

                    let earningTotal = [];

                    for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                        const formattedDate = date.format('YYYY-MM-DD');
                        if (earningTotalMap[formattedDate]) {
                            earningTotal.push({ updatedAt: formattedDate, totalAmount: earningTotalMap[formattedDate] });
                        } else {
                            earningTotal.push({ updatedAt: formattedDate, totalAmount: 0 });
                        }
                    }

                    let listAmountByDay = await db.DetailOrder.findAll({
                        where: {
                            paymentStatus: 'P'
                        },
                        include: [{
                            model: db.Schedule,
                            where: {
                                workDay: {
                                    [Op.between]: [startDate, endDate]
                                }
                            }
                        }, {
                            model: db.Order,
                            include: [{
                                model: db.Categori
                            }]
                        }]
                    });

                    let listAmountByService = listService.map(item => {
                        let idService = item.id;
                        let orderByService = listAmountByDay.filter(order => order.Order.Categori.ID_Service === idService);
                        let totalAmountService = orderByService.reduce((total, order) => total + order.totalAmount, 0);
                        return {
                            service: item,
                            orders: orderByService,
                            totalAmount: totalAmountService
                        };
                    })

                    let totalAmount = listAmountByService.reduce((total, amount) => total + amount.totalAmount, 0)

                    resolve({ success: true, message: "Thống kê toàn bộ doanh thu", earningTotal, listAmountByService, totalAmount });
                }


            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async earningByCategoriService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.dateSendCategori) {
                    if (data.dateSendCategori.typeCategori === 'datepicker') {
                        const startDate = moment(data.dateSendCategori.data[0]);
                        const endDate = moment(data.dateSendCategori.data[1]);
                        let listAmount = await db.DetailOrder.findAll({
                            where: {
                                paymentStatus: 'P'
                            },
                            include: [{
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startDate, endDate]
                                    }
                                }
                            }, {
                                model: db.Order
                            }]
                        });

                        let listCategori = await db.Categori.findAll();
                        let listOrderByCategori = listCategori.map(item => {
                            let idCategori = item.id;
                            let orderByCategori = listAmount.filter(order => order.Order.ID_Categori === idCategori)
                            let totalAmount = orderByCategori.reduce((total, order) => total + order.totalAmount, 0);
                            return {
                                categori: item,
                                orders: orderByCategori,
                                totalAmount: totalAmount
                            };
                        });

                        let totalAmount = listOrderByCategori.reduce((total, amount) => total + amount.totalAmount, 0)

                        resolve({ success: true, message: "Thống kê doanh thu theo ngày loại thiết bị", listOrderByCategori, totalAmount });
                    }
                    if (data.dateSendCategori.typeCategori === 'month') {
                        const month = moment(data.dateSendCategori.data, "YYYY-MM");
                        // const daysInMonth = month.daysInMonth();
                        const firstDayOfMonth = month.startOf('month');
                        const endDayOfMonth = month.clone().endOf('month')

                        let listAmount = await db.DetailOrder.findAll({
                            where: {
                                paymentStatus: 'P'
                            },
                            include: [{
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [firstDayOfMonth, endDayOfMonth]
                                    }
                                }
                            }, {
                                model: db.Order
                            }]
                        });

                        let listCategori = await db.Categori.findAll();
                        let listOrderByCategori = listCategori.map(item => {
                            let idCategori = item.id;
                            let orderByCategori = listAmount.filter(order => order.Order.ID_Categori === idCategori)
                            let totalAmount = orderByCategori.reduce((total, order) => total + order.totalAmount, 0);
                            return {
                                categori: item,
                                orders: orderByCategori,
                                totalAmount: totalAmount
                            };
                        });
                        let totalAmount = listOrderByCategori.reduce((total, amount) => total + amount.totalAmount, 0)
                        resolve({ success: true, message: "Thống kê doanh thu theo tháng loại thiết bị", listOrderByCategori, totalAmount });
                    }
                    if (data.dateSendCategori.typeCategori === 'year') {
                        const year = parseInt(data.dateSendCategori.data);
                        const startOfYear = moment(year, "YYYY").startOf('year');
                        const endOfYear = moment(year, "YYYY").endOf('year');

                        let listAmount = await db.DetailOrder.findAll({
                            where: {
                                paymentStatus: 'P'
                            },
                            include: [{
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startOfYear, endOfYear]
                                    }
                                }
                            }, {
                                model: db.Order
                            }]
                        });

                        let listCategori = await db.Categori.findAll();
                        let listOrderByCategori = listCategori.map(item => {
                            let idCategori = item.id;
                            let orderByCategori = listAmount.filter(order => order.Order.ID_Categori === idCategori)
                            let totalAmount = orderByCategori.reduce((total, order) => total + order.totalAmount, 0);
                            return {
                                categori: item,
                                orders: orderByCategori,
                                totalAmount: totalAmount
                            };
                        });
                        let totalAmount = listOrderByCategori.reduce((total, amount) => total + amount.totalAmount, 0)
                        resolve({ success: true, message: "Thống kê doanh thu theo năm loại thiết bị", listOrderByCategori, totalAmount });
                    }
                } else {
                    const today = moment();
                    const startDate = today.clone().startOf('week');
                    const endDate = today.clone().endOf('week');

                    let listAmount = await db.DetailOrder.findAll({
                        where: {
                            paymentStatus: 'P'
                        },
                        include: [{
                            model: db.Schedule,
                            where: {
                                workDay: {
                                    [Op.between]: [startDate, endDate]
                                }
                            }
                        }, {
                            model: db.Order
                        }]
                    });

                    let listCategori = await db.Categori.findAll();
                    let listOrderByCategori = listCategori.map(item => {
                        let idCategori = item.id;
                        let orderByCategori = listAmount.filter(order => order.Order.ID_Categori === idCategori)
                        let totalAmount = orderByCategori.reduce((total, order) => total + order.totalAmount, 0);
                        return {
                            categori: item,
                            orders: orderByCategori,
                            totalAmount: totalAmount
                        };
                    });
                    let totalAmount = listOrderByCategori.reduce((total, amount) => total + amount.totalAmount, 0)
                    resolve({ success: true, message: "Thống kê toàn bộ doanh thu theo loại thiết bị", listOrderByCategori, totalAmount });

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
                let listOrder = await db.DetailOrder.findAll({
                    include: [{
                        model: db.Order,
                        where: {
                            status: {
                                [Op.notIn]: ['W', 'P', 'C']
                            }
                        },
                        include: [{
                            model: db.Categori
                        }]
                    }, {
                        model: db.Schedule
                    }]
                });
                let orderTotalMap = {};
                listOrder.forEach(item => {
                    const formattedDate = moment(item.Schedule.workDay).format('YYYY-MM-DD');

                    if (!orderTotalMap[formattedDate]) {
                        orderTotalMap[formattedDate] = {
                            count: 1
                        }
                    } else {
                        orderTotalMap[formattedDate].count++
                    }
                });
                let listService = await db.Service.findAll();

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
                        let listOrderByServiceDay = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P', 'C']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startDate, endDate]
                                    }
                                }
                            }]
                        })

                        let totalOrderByService = listService.map(item => {
                            let idService = item.id;
                            let ordersForService = listOrderByServiceDay.filter(order => order.Order.Categori.ID_Service === idService);
                            return {
                                service: item,
                                orders: ordersForService
                            };
                        });


                        resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", orderTotal, totalOrderByService });
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
                        const endDayOfMonth = month.clone().endOf('month')

                        let listOrderByServiceDay = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P', 'C']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [firstDayOfMonth, endDayOfMonth]
                                    }
                                }
                            }]
                        })

                        let totalOrderByService = listService.map(item => {
                            let idService = item.id;
                            let ordersForService = listOrderByServiceDay.filter(order => order.Order.Categori.ID_Service === idService);
                            return {
                                service: item,
                                orders: ordersForService
                            };
                        });
                        resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa theo tháng", orderTotal, totalOrderByService });
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


                        const startOfYear = moment(year, "YYYY").startOf('year');
                        const endOfYear = moment(year, "YYYY").endOf('year');


                        let listOrderByServiceDay = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P', 'C']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startOfYear, endOfYear]
                                    }
                                }
                            }]
                        })

                        let totalOrderByService = listService.map(item => {
                            let idService = item.id;
                            let ordersForService = listOrderByServiceDay.filter(order => order.Order.Categori.ID_Service === idService);
                            return {
                                service: item,
                                orders: ordersForService
                            };
                        });

                        resolve({ success: true, message: "Thống kê toàn bộ đơn sủa chữa theo năm", orderTotal, totalOrderByService });
                    }

                    else {
                        resolve({ success: false, message: "Vui lòng chọn thời gian" });
                    }

                } else {
                    // const today = moment();
                    // const startDate = today.clone().startOf('week');
                    // const endDate = today.clone().endOf('week');
                    const today = moment();
                    const startDate = today.clone().subtract(6, 'days').startOf('day');
                    const endDate = today.clone().endOf('day');
                    let orderTotal = [];

                    for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                        const formattedDate = date.format('YYYY-MM-DD');
                        if (orderTotalMap[formattedDate]) {
                            orderTotal.push({ createdAt: formattedDate, count: orderTotalMap[formattedDate].count });
                        } else {
                            orderTotal.push({ createdAt: formattedDate, count: 0 });
                        }
                    }

                    let listOrderByServiceDay = await db.DetailOrder.findAll({
                        include: [{
                            model: db.Order,
                            where: {
                                status: {
                                    [Op.notIn]: ['W', 'P', 'C']
                                }
                            },
                            include: [{
                                model: db.Categori
                            }]
                        }, {
                            model: db.Schedule,
                            where: {
                                workDay: {
                                    [Op.between]: [startDate, endDate]
                                }
                            }
                        }]
                    })

                    let totalOrderByService = listService.map(item => {
                        let idService = item.id;
                        let ordersForService = listOrderByServiceDay.filter(order => order.Order.Categori.ID_Service === idService);
                        return {
                            service: item,
                            orders: ordersForService
                        };
                    });

                    resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", orderTotal, totalOrderByService });
                }


            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async orderStatisticalByCategoriService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let listCategori = await db.Categori.findAll();

                if (data.dateSendCategori) {
                    if (data.dateSendCategori.typeCategori === 'datepicker') {
                        const startDate = moment(data.dateSendCategori.data[0]);
                        const endDate = moment(data.dateSendCategori.data[1]);


                        let listOrderByCategoriDay = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P', 'C']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startDate, endDate]
                                    }
                                }
                            }]
                        })

                        let totalOrderByCategori = listCategori.map(item => {
                            let idCategori = item.id;
                            let ordersForService = listOrderByCategoriDay.filter(order => order.Order.ID_Categori === idCategori);
                            return {
                                categori: item,
                                orders: ordersForService
                            };
                        });


                        resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", totalOrderByCategori });
                    }
                    if (data.dateSendCategori.typeCategori === 'month') {
                        const month = moment(data.dateSendCategori.data, "YYYY-MM");
                        const daysInMonth = month.daysInMonth();
                        const firstDayOfMonth = month.startOf('month');

                        const endDayOfMonth = month.clone().endOf('month')

                        let listOrderByCategoriDay = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P', 'C']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [firstDayOfMonth, endDayOfMonth]
                                    }
                                }
                            }]
                        })


                        let totalOrderByCategori = listCategori.map(item => {
                            let idCategori = item.id;
                            let ordersForService = listOrderByCategoriDay.filter(order => order.Order.ID_Categori === idCategori);
                            return {
                                categori: item,
                                orders: ordersForService
                            };
                        });
                        resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa theo tháng", totalOrderByCategori });
                    }
                    if (data.dateSendCategori.typeCategori === 'year') {
                        const year = parseInt(data.dateSendCategori.data);
                        const startOfYear = moment(year, "YYYY").startOf('year');
                        const endOfYear = moment(year, "YYYY").endOf('year');

                        let listOrderByCategoriDay = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P', 'C']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startOfYear, endOfYear]
                                    }
                                }
                            }]
                        })

                        let totalOrderByCategori = listCategori.map(item => {
                            let idCategori = item.id;
                            let ordersForService = listOrderByCategoriDay.filter(order => order.Order.ID_Categori === idCategori);
                            return {
                                categori: item,
                                orders: ordersForService
                            };
                        });

                        resolve({ success: true, message: "Thống kê toàn bộ đơn sủa chữa theo năm", totalOrderByCategori });
                    }

                    else {
                        resolve({ success: false, message: "Vui lòng chọn thời gian" });
                    }

                } else {
                    // const today = moment();
                    // const startDate = today.clone().startOf('week');
                    // const endDate = today.clone().endOf('week');
                    const today = moment();
                    const startDate = today.clone().subtract(6, 'days').startOf('day');
                    const endDate = today.clone().endOf('day');
                    let listOrderByCategoriDay = await db.DetailOrder.findAll({
                        include: [{
                            model: db.Order,
                            where: {
                                status: {
                                    [Op.notIn]: ['W', 'P', 'C']
                                }
                            },
                            include: [{
                                model: db.Categori
                            }]
                        }, {
                            model: db.Schedule,
                            where: {
                                workDay: {
                                    [Op.between]: [startDate, endDate]
                                }
                            }
                        }]
                    })

                    let totalOrderByCategori = listCategori.map(item => {
                        let idCategori = item.id;
                        let ordersForService = listOrderByCategoriDay.filter(order => order.Order.ID_Categori === idCategori);
                        return {
                            categori: item,
                            orders: ordersForService
                        };
                    });

                    resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", totalOrderByCategori });
                }


            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async repairerStatisticService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                let listRepairer = await db.Repairer.findAll({
                    where: {
                        status: { [Op.ne]: 'D' }
                    }
                });

                if (data.dateSend) {
                    if (data.dateSend.type === 'datepicker') {
                        const startDate = moment(data.dateSend.data[0]);
                        const endDate = moment(data.dateSend.data[1]);

                        let listOrderByRepairer = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startDate, endDate]
                                    }
                                }
                            }]
                        })

                        let totalOrderByRepaier = listRepairer.map(item => {
                            let idRepairer = item.id;
                            let orderByRepaierSuccess = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'S');
                            let orderByRepaierFail = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'C');

                            return {
                                repairer: item,
                                ordersSuccess: orderByRepaierSuccess,
                                ordersFail: orderByRepaierFail,
                            };
                        });


                        let totalOrderSuccess = totalOrderByRepaier.reduce((total, order) => total + order.ordersSuccess.length, 0)
                        let totalOrderFail = totalOrderByRepaier.reduce((total, order) => total + order.ordersFail.length, 0)


                        resolve({ success: true, message: "Thống kê đơn sửa chữa theo ngày của thợ", totalOrderByRepaier, totalOrderSuccess, totalOrderFail });
                    }
                    if (data.dateSend.type === 'month') {
                        const month = moment(data.dateSend.data, "YYYY-MM");
                        const daysInMonth = month.daysInMonth();
                        const firstDayOfMonth = month.startOf('month');

                        const endDayOfMonth = month.clone().endOf('month')

                        let listOrderByRepairer = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [firstDayOfMonth, endDayOfMonth]
                                    }
                                }
                            }]
                        })

                        let totalOrderByRepaier = listRepairer.map(item => {
                            let idRepairer = item.id;
                            let orderByRepaierSuccess = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'S');
                            let orderByRepaierFail = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'C');

                            return {
                                repairer: item,
                                ordersSuccess: orderByRepaierSuccess,
                                ordersFail: orderByRepaierFail,
                            };
                        });


                        let totalOrderSuccess = totalOrderByRepaier.reduce((total, order) => total + order.ordersSuccess.length, 0)
                        let totalOrderFail = totalOrderByRepaier.reduce((total, order) => total + order.ordersFail.length, 0)


                        resolve({ success: true, message: "Thống kê đơn sửa chữa theo ngày của thợ", totalOrderByRepaier, totalOrderSuccess, totalOrderFail });
                    }
                    if (data.dateSend.type === 'year') {
                        const year = parseInt(data.dateSend.data);
                        const startOfYear = moment(year, "YYYY").startOf('year');
                        const endOfYear = moment(year, "YYYY").endOf('year');

                        let listOrderByRepairer = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    status: {
                                        [Op.notIn]: ['W', 'P']
                                    }
                                },
                                include: [{
                                    model: db.Categori
                                }]
                            }, {
                                model: db.Schedule,
                                where: {
                                    workDay: {
                                        [Op.between]: [startOfYear, endOfYear]
                                    }
                                }
                            }]
                        })

                        let totalOrderByRepaier = listRepairer.map(item => {
                            let idRepairer = item.id;
                            let orderByRepaierSuccess = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'S');
                            let orderByRepaierFail = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'C');

                            return {
                                repairer: item,
                                ordersSuccess: orderByRepaierSuccess,
                                ordersFail: orderByRepaierFail,
                            };
                        });


                        let totalOrderSuccess = totalOrderByRepaier.reduce((total, order) => total + order.ordersSuccess.length, 0)
                        let totalOrderFail = totalOrderByRepaier.reduce((total, order) => total + order.ordersFail.length, 0)


                        resolve({ success: true, message: "Thống kê đơn sửa chữa theo ngày của thợ", totalOrderByRepaier, totalOrderSuccess, totalOrderFail });
                    }

                    else {
                        resolve({ success: false, message: "Vui lòng chọn thời gian" });
                    }

                } else {
                    // const today = moment();
                    // const startDate = today.clone().startOf('week');
                    // const endDate = today.clone().endOf('week');
                    const today = moment();
                    const startDate = today.clone().subtract(6, 'days').startOf('day');
                    const endDate = today.clone().endOf('day');
                    let listOrderByRepairer = await db.DetailOrder.findAll({
                        include: [{
                            model: db.Order,
                            where: {
                                status: {
                                    [Op.notIn]: ['W', 'P']
                                }
                            },
                            include: [{
                                model: db.Categori
                            }]
                        }, {
                            model: db.Schedule,
                            where: {
                                workDay: {
                                    [Op.between]: [startDate, endDate]
                                }
                            }
                        }]
                    })

                    let totalOrderByRepaier = listRepairer.map(item => {
                        let idRepairer = item.id;
                        let orderByRepaierSuccess = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'S');
                        let orderByRepaierFail = listOrderByRepairer.filter(order => order.Schedule.ID_Repairer === idRepairer && order.Order.status === 'C');

                        return {
                            repairer: item,
                            ordersSuccess: orderByRepaierSuccess,
                            ordersFail: orderByRepaierFail,
                        };
                    });


                    let totalOrderSuccess = totalOrderByRepaier.reduce((total, order) => total + order.ordersSuccess.length, 0)
                    let totalOrderFail = totalOrderByRepaier.reduce((total, order) => total + order.ordersFail.length, 0)

                    resolve({ success: true, message: "Thống kê đơn sửa chữa theo thợ", totalOrderByRepaier, totalOrderSuccess, totalOrderFail });
                }


            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async overviewJobService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_Repairer = data.ID_Repairer;
                let existRepairer = await db.Repairer.findOne({
                    where: {
                        id: ID_Repairer
                    }
                })
                if (existRepairer) {
                    let listJob = await db.DetailOrder.findAll({
                        include: [{
                            model: db.Schedule,
                            where: {
                                ID_Repairer: ID_Repairer
                            }
                        }, {
                            model: db.Order,
                        }]
                    })
                    resolve({ success: true, message: "Danh sách công việc", listJob })
                } else {
                    resolve({ success: false, message: "Không tìm thấy người dùng" })

                }

            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async jobStatisticalService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_Repairer = data.id;
                let existRepairer = await db.Repairer.findOne({
                    where: {
                        id: ID_Repairer
                    }
                })
                if (existRepairer) {
                    let listJob = await db.DetailOrder.findAll({
                        include: [{
                            model: db.Schedule,
                            attributes: ['workDay'],
                            where: {
                                ID_Repairer: ID_Repairer
                            }
                        }, {
                            model: db.Order,
                            where: {
                                status: { [Op.notIn]: ['W', 'P'] }
                            }
                        }]
                    })


                    // let jobTotalMap = {};
                    // listJob.forEach(item => {
                    //     const formattedDate = moment(item.Schedule.workDay).format('YYYY-MM-DD');
                    //     if (!jobTotalMap[formattedDate]) {
                    //         jobTotalMap[formattedDate] = {
                    //             count: 1
                    //         }
                    //     } else {
                    //         jobTotalMap[formattedDate].count++
                    //     }
                    // });

                    if (data.dateSend) {
                        if (data.dateSend.type === 'datepicker') {
                            const startDate = moment(data.dateSend.data[0]);
                            const endDate = moment(data.dateSend.data[1]);
                            let jobTotal = [];

                            for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                                const formattedDate = date.format('YYYY-MM-DD');
                                const jobsOnDate = listJob.filter(item => moment(item.Schedule.workDay).format('YYYY-MM-DD') === formattedDate);

                                const successfulJobs = jobsOnDate.filter(job => job.Order.status === 'S').length;
                                const failedJobs = jobsOnDate.filter(job => job.Order.status === 'C').length;

                                jobTotal.push({ workDay: formattedDate, successfulJobs, failedJobs });
                            }
                            let totalOrderSuccess = jobTotal.reduce((total, item) => total + item.successfulJobs, 0)
                            let totalOrderFail = jobTotal.reduce((total, item) => total + item.failedJobs, 0)

                            resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", jobTotal, totalOrderSuccess, totalOrderFail });
                        }
                        if (data.dateSend.type === 'month') {
                            const month = moment(data.dateSend.data, "YYYY-MM");
                            const daysInMonth = month.daysInMonth();
                            const firstDayOfMonth = month.startOf('month');
                            let jobTotal = [];
                            // for (let i = 0; i < daysInMonth; i++) {
                            //     const currentDay = firstDayOfMonth.clone().add(i, 'days');
                            //     const formattedDate = currentDay.format('YYYY-MM-DD');
                            //     if (jobTotalMap[formattedDate]) {
                            //         jobTotal.push({ workDay: formattedDate, count: jobTotalMap[formattedDate].count });
                            //     } else {
                            //         jobTotal.push({ workDay: formattedDate, count: 0 });
                            //     }
                            // }
                            for (let i = 0; i < daysInMonth; i++) {
                                const currentDay = firstDayOfMonth.clone().add(i, 'days');
                                const formattedDate = currentDay.format('YYYY-MM-DD');
                                const jobsOnDate = listJob.filter(item => moment(item.Schedule.workDay).format('YYYY-MM-DD') === formattedDate);
                                const successfulJobs = jobsOnDate.filter(job => job.Order.status === 'S').length;
                                const failedJobs = jobsOnDate.filter(job => job.Order.status === 'C').length;

                                jobTotal.push({ workDay: formattedDate, successfulJobs, failedJobs });
                            }

                            let totalOrderSuccess = jobTotal.reduce((total, item) => total + item.successfulJobs, 0)
                            let totalOrderFail = jobTotal.reduce((total, item) => total + item.failedJobs, 0)

                            resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa theo tháng", jobTotal, totalOrderSuccess, totalOrderFail });


                        }
                        if (data.dateSend.type === 'year') {
                            let jobTotal = [];
                            const year = parseInt(data.dateSend.data);
                            const startOfYear = moment(year, "YYYY").startOf('year');
                            const endOfYear = moment(year, "YYYY").endOf('year');

                            for (let date = moment(startOfYear); date <= endOfYear; date = date.clone().add(1, 'month')) {
                                const formattedDate = date.format('YYYY-MM');
                                const jobsOnDate = listJob.filter(item => moment(item.Schedule.workDay).format('YYYY-MM') === formattedDate);

                                const successfulJobs = jobsOnDate.filter(job => job.Order.status === 'S').length;
                                const failedJobs = jobsOnDate.filter(job => job.Order.status === 'C').length;

                                jobTotal.push({ workDay: formattedDate, successfulJobs, failedJobs });
                            }
                            let totalOrderSuccess = jobTotal.reduce((total, item) => total + item.successfulJobs, 0)
                            let totalOrderFail = jobTotal.reduce((total, item) => total + item.failedJobs, 0)

                            resolve({ success: true, message: "Thống kê toàn bộ đơn sủa chữa theo năm", jobTotal, totalOrderSuccess, totalOrderFail });
                        }

                        else {
                            resolve({ success: false, message: "Vui lòng chọn thời gian" });
                        }

                    }
                    else {
                        // const today = moment();
                        // const startDate = today.clone().startOf('week');
                        // const endDate = today.clone().endOf('week');
                        const today = moment();
                        const startDate = today.clone().subtract(6, 'days').startOf('day');
                        const endDate = today.clone().endOf('day');

                        let jobTotal = [];
                        for (let date = moment(startDate); date <= endDate; date = date.clone().add(1, 'day')) {
                            const formattedDate = date.format('YYYY-MM-DD');
                            const jobsOnDate = listJob.filter(item => moment(item.Schedule.workDay).format('YYYY-MM-DD') === formattedDate);

                            const successfulJobs = jobsOnDate.filter(job => job.Order.status === 'S').length;
                            const failedJobs = jobsOnDate.filter(job => job.Order.status === 'C').length;

                            jobTotal.push({ workDay: formattedDate, successfulJobs, failedJobs });
                        }

                        let totalOrderSuccess = jobTotal.reduce((total, item) => total + item.successfulJobs, 0)
                        let totalOrderFail = jobTotal.reduce((total, item) => total + item.failedJobs, 0)
                        resolve({ success: true, message: "Thống kê toàn bộ đơn sửa chữa", jobTotal, totalOrderSuccess, totalOrderFail });
                    }


                } else {
                    resolve({ success: false, message: "Không tìm thấy người dùng" })

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