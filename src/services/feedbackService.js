const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const moment = require('moment')

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
                        let listFeedback = await db.FeedbackOrder.findAll({
                            where: {
                                accountType: role
                            },
                            include: [{
                                model: db.Order,
                                include: [{
                                    model: db.DetailOrder,
                                    include: [{
                                        model: db.Schedule,
                                        where: {
                                            ID_Repairer: ID_User
                                        }
                                    }]
                                }]
                            }]
                        })
                        resolve({ success: true, message: "Danh sách phản hồi", listFeedback })

                    } else {
                        resolve({ success: false, message: "Không tìm thấy người dùng" })
                    }
                } else if (role === 'KH') {
                    let existUser = await db.User.findByPk(ID_User)
                    console.log("Day la khach hang")
                    if (existUser) {
                        console.log(existRepairer)

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
                const dateChange = moment(data.dateChange).format('YYYY-MM-DD')
                const contentFeedback = data.contentFeedback;
                let existOrder = await db.Order.findByPk(ID_Order)
                if (existOrder) {
                    const message = `Bạn có phản hồi từ đơn sửa chữa ID ${ID_Order}`;
                    let newFeedback = await db.FeedbackOrder.create({
                        ID_Order: ID_Order,
                        accountType: accountType,
                        feedbackType: feedbackType,
                        contentFeedback: contentFeedback,
                        dateChange: dateChange,
                        feedbackStatus: 'W'
                    })
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

}


module.exports = new FeedbackService();