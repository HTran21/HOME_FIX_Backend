const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const { where } = require("sequelize");

class UserService {
    async handleConfirmPayment(ID_DetailOrder) {
        return new Promise(async (resolve, reject) => {
            try {

                let existDetailOrder = await db.DetailOrder.findOne({ where: { id: ID_DetailOrder }, raw: true });
                if (existDetailOrder) {
                    await db.DetailOrder.update({
                        paymentStatus: 'P'
                    }, {
                        where: {
                            id: ID_DetailOrder
                        }
                    })
                    resolve({ success: true, message: "Đã xác nhận thanh toán thành công" })
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