const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const moment = require('moment');

class FeedbackService {

    async getAllFeedbackService() {
        return new Promise(async (resolve, reject) => {
            try {
                let listFeedback = await db.FeedbackOrder.findAll({
                    include: [{
                        model: db.Order,
                        include: [{
                            model: db.DetailOrder,
                            include: [{
                                model: db.Schedule,
                                include: [{
                                    model: db.Repairer,
                                    attributes: {
                                        exclude: ['passwordRepairer']
                                    }
                                },
                                ]
                            }]
                        },
                        {
                            model: db.User,
                            attributes: { exclude: ['password'] }
                        }, {
                            model: db.Categori,
                            include: [{
                                model: db.Service
                            }]
                        }]
                    }]
                })
                resolve(listFeedback)
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async getByUserService(ID_User, role) {
        return new Promise(async (resolve, reject) => {
            try {
                if (role === 'RP') {
                    let existRepairer = await db.Repairer.findByPk(ID_User)
                    if (existRepairer) {
                        let listOrder = await db.DetailOrder.findAll({
                            include: [
                                {
                                    model: db.Schedule,
                                    where: {
                                        ID_Repairer: ID_User,
                                    },

                                },
                                {
                                    model: db.Order,
                                }
                            ]
                        });

                        // let listFeedbackPromise = listOrder.map(async item => {
                        //     let orderID = item.Order.id;
                        //     let feedback = await db.FeedbackOrder.findAll({
                        //         where: {
                        //             accountType: role,
                        //             ID_Order: orderID
                        //         }
                        //     });
                        //     return {
                        //         // detail: item,
                        //         feedback: feedback
                        //     }
                        // })
                        // const results = await Promise.all(listFeedbackPromise)
                        // let listFeedback = [];
                        // results.map(item => {
                        //     if (item.feedback.length > 0) {
                        //         listFeedback.push(item)
                        //     } else {
                        //         return;
                        //     }
                        // })

                        let listFeedbackPromise = listOrder.map(async item => {
                            let orderID = item.ID_Order;
                            let feedback = await db.FeedbackOrder.findAll({
                                where: {
                                    accountType: role,
                                    ID_Order: orderID
                                },
                                include: [{
                                    model: db.Order,
                                    include: [{
                                        model: db.DetailOrder,
                                        include: [{
                                            model: db.Schedule,
                                            include: [{
                                                model: db.Repairer,
                                                attributes: {
                                                    exclude: ['passwordRepairer']
                                                }
                                            }]
                                        }]
                                    }, {
                                        model: db.Categori,
                                        include: [{
                                            model: db.Service
                                        }]
                                    }]
                                }]
                            });
                            return {
                                detail: item,
                                feedback: feedback
                            }
                        })
                        const results = await Promise.all(listFeedbackPromise)
                        const filteredResult = results.filter(item => item.feedback.length > 0);
                        const listFeedback = [].concat(...filteredResult.map(item => item.feedback));

                        resolve({ success: true, message: "Danh sách phản hồi", listFeedback })

                    } else {
                        resolve({ success: false, message: "Không tìm thấy người dùng" })
                    }
                } else if (role === 'KH') {
                    let existUser = await db.User.findByPk(ID_User)
                    if (existUser) {
                        let listOrder = await db.DetailOrder.findAll({
                            include: [{
                                model: db.Order,
                                where: {
                                    ID_User: ID_User
                                }
                            }],
                        });
                        let listFeedbackPromise = listOrder.map(async item => {
                            let orderID = item.ID_Order;
                            let feedback = await db.FeedbackOrder.findAll({
                                where: {
                                    accountType: role,
                                    ID_Order: orderID
                                },
                                include: [{
                                    model: db.Order,
                                    include: [{
                                        model: db.DetailOrder,
                                        include: [{
                                            model: db.Schedule,
                                            include: [{
                                                model: db.Repairer,
                                                attributes: {
                                                    exclude: ['passwordRepairer']
                                                }
                                            }]
                                        }]
                                    }, {
                                        model: db.Categori,
                                        include: [{
                                            model: db.Service
                                        }]
                                    }]
                                }]
                            });
                            return {
                                detail: item,
                                feedback: feedback
                            }
                        })
                        const results = await Promise.all(listFeedbackPromise)
                        const filteredResult = results.filter(item => item.feedback.length > 0);
                        const listFeedback = [].concat(...filteredResult.map(item => item.feedback));

                        resolve({ success: true, message: "Danh sách phản hồi", listFeedback })

                    } else {
                        resolve({ success: false, message: "Không tìm thấy người dùng" })
                    }
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async createFeedbackService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_Order = data.ID_Order;
                const accountType = data.role;
                const feedbackType = data.feedbackType;
                const contentFeedback = data.contentFeedback;
                let existOrder = await db.Order.findByPk(ID_Order)
                if (existOrder) {
                    const message = `Bạn có phản hồi từ đơn sửa chữa ID ${ID_Order}`;
                    console.log("Datechange", data.dateChange)
                    const newFeedback = {
                        ID_Order: ID_Order,
                        accountType: accountType,
                        feedbackType: feedbackType,
                        contentFeedback: contentFeedback,
                        feedbackStatus: 'W'
                    }
                    if (data.dateChange) {
                        let dateChange = moment(data.dateChange).format('YYYY-MM-DD');
                        newFeedback.dateChange = dateChange
                    }
                    await db.FeedbackOrder.create(newFeedback)
                    // let newFeedback = await db.FeedbackOrder.create({
                    //     ID_Order: ID_Order,
                    //     accountType: accountType,
                    //     feedbackType: feedbackType,
                    //     contentFeedback: contentFeedback,
                    //     dateChange: dateChange,
                    //     feedbackStatus: 'W'
                    // })
                    await db.Notification.create({
                        receiveID: 0,
                        contentNotification: message,
                        typeNotification: "order_feedback",
                        read: "UR",
                        accountType: "AD"
                    });
                    resolve({ success: true, message: "Đã phản hồi về đơn sửa chữa", newFeedback })
                } else {
                    resolve({ success: false, message: "Không tìm thấy đơn sửa chữa" })
                }

            }
            catch (error) {
                reject(error);
            }
        })
    }

    async deniedFeedbackService(ID_Feedback, role) {
        return new Promise(async (resolve, reject) => {
            try {
                let existFeedback = await db.FeedbackOrder.findByPk(ID_Feedback);
                if (existFeedback) {
                    if (role === 'AD') {
                        await db.FeedbackOrder.update({
                            feedbackStatus: 'D'
                        }, {
                            where: {
                                id: ID_Feedback
                            }
                        })
                        if (existFeedback.accountType === 'KH') {
                            let order = await db.Order.findOne({
                                where: {
                                    id: existFeedback.ID_Order
                                }
                            })
                            let ID_User = order.ID_User;
                            let message = `Phản hồi về đơn sửa chữa ID ${order.id} đã bị từ chối`;
                            await db.Notification.create({
                                receiveID: ID_User,
                                contentNotification: message,
                                typeNotification: "order_feedback_denied",
                                read: "UR",
                                accountType: "KH"
                            });
                            resolve({ success: true, message: "Phản hồi đã bị từ chối" })
                        } else if (existFeedback.accountType === 'RP') {
                            let detailOrder = await db.DetailOrder.findOne({
                                where: {
                                    ID_Order: existFeedback.ID_Order
                                },
                                include: [{
                                    model: db.Schedule
                                }]
                            })
                            let ID_Repairer = detailOrder.Schedule.ID_Repairer;
                            let message = `Phản hồi về đơn sửa chữa ID ${order.id} đã bị từ chối`;
                            await db.Notification.create({
                                receiveID: ID_Repairer,
                                contentNotification: message,
                                typeNotification: "order_feedback_denied",
                                read: "UR",
                                accountType: "RP"
                            });
                            resolve({ success: true, message: "Phản hồi đã bị từ chối" })
                        }

                    } else {
                        await db.FeedbackOrder.destroy({
                            where: {
                                id: ID_Feedback
                            }
                        })
                        resolve({ success: true, message: "Phản hồi đã được xóa" })
                    }
                } else {
                    resolve({ success: false, message: "Không tìm thấy phản hồi" })
                }

            }
            catch (error) {
                reject(error);
            }
        })
    }

}


module.exports = new FeedbackService();