const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');

class UserService {
    async handleConfirmPayment(ID_DetailOrder, paymentMethod) {
        return new Promise(async (resolve, reject) => {
            try {

                let existDetailOrder = await db.DetailOrder.findOne({
                    where: { id: ID_DetailOrder },
                    include: [{
                        model: db.Order,
                        include: [{
                            model: db.Categori
                        }]
                    }]
                    // , raw: true
                });

                if (existDetailOrder) {
                    if (paymentMethod === 'cash') {
                        await db.DetailOrder.update({
                            paymentMethod: paymentMethod,
                            paymentStatus: 'P'
                        }, {
                            where: {
                                id: ID_DetailOrder
                            }
                        })
                        resolve({ success: true, message: "Thanh toán thành công" })
                    }
                    else if (paymentMethod === 'vnpay') {
                        await db.DetailOrder.update({
                            paymentMethod: paymentMethod
                        }, {
                            where: {
                                id: ID_DetailOrder
                            }
                        })
                        const ID_User = existDetailOrder.dataValues.Order.ID_User;
                        const message = `Bạn có yêu cầu thanh toán đơn sửa chữa ${existDetailOrder.dataValues.Order.Categori.nameCategories} ID ${existDetailOrder.dataValues.Order.id}`;
                        await db.Notification.create({
                            receiveID: ID_User,
                            contentNotification: message,
                            typeNotification: "payment_request",
                            read: "UR",
                            accountType: "KH"
                        });
                        resolve({ success: true, message: "Chọn phương thức thanh toán thành công" })
                    }
                    else {
                        resolve({ success: false, message: "Phương thức thanh toán không tồn tại" })
                    }

                } else {
                    resolve({ success: false, message: "Không tìm thấy đơn hàng" })
                }
            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

}

module.exports = new UserService();