const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');

class NotificationService {
    async getNotificationService(ID_User, role) {
        return new Promise(async (resolve, reject) => {
            try {
                let listNotificaion = await db.Notification.findAll({
                    where: {
                        receiveID: ID_User,
                        accountType: role
                    },
                    order: [
                        ['createdAt', 'DESC'] // Sắp xếp theo thời gian tạo giảm dần
                    ]
                })
                resolve(listNotificaion)
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async changeReadNotificationService(listNotification) {
        return new Promise(async (resolve, reject) => {
            try {
                for (const notification of listNotification) {
                    let ID_Notification = notification.id
                    await db.Notification.update({
                        read: 'R'
                    }, {
                        where: { id: ID_Notification }
                    })
                }
                resolve({ success: true, message: "Đã cập nhật trạng thái đã đọc" })

            }
            catch (error) {
                reject(error);
            }
        })
    }

    // async notificationOrderNew(ID_User, message, accountType) {
    //     try {
    //         let newNotification = await db.Notification.create({
    //             receiveID: ID_User,
    //             contentNotification: message,
    //             typeNotification: "order_new",
    //             read: "UR",
    //             accountType: accountType
    //         })
    //         return newNotification;
    //     }
    //     catch (error) {
    //         console.log(error)
    //         return (error);
    //     }
    // }
}


module.exports = new NotificationService();