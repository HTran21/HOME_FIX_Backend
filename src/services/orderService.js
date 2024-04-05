const db = require('../app/models/index');
const { Op } = require('sequelize');
const { deleteOrder } = require('../controller/OrderController');

class OrderService {

    async createOrderService(idUser, fullName, address, phone, email, idCategori, idProduct, desRepair, dateRepair, status) {
        return new Promise(async (resolve, reject) => {

            try {
                if (idProduct) {
                    let newOrder = await db.Order.create({
                        ID_User: idUser,
                        ID_Categori: idCategori,
                        ID_Product: idProduct,
                        fullName: fullName,
                        address: address,
                        phone: phone,
                        email: email,
                        desProblem: desRepair,
                        desireDate: dateRepair,
                        status: status
                    })
                    resolve({ success: true, message: "Đăng ký sửa chữa thành công" });
                }
                else {
                    let newOrder = await db.Order.create({
                        ID_User: idUser,
                        ID_Categori: idCategori,
                        fullName: fullName,
                        address: address,
                        phone: phone,
                        email: email,
                        desProblem: desRepair,
                        desireDate: dateRepair,
                        status: status
                    })
                    resolve({ success: true, message: "Đăng ký sửa chữa thành công" });
                }
            }
            catch (error) {
                reject(error)
            }

        })
    }

    async getOrderUserService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let listOrder = await db.Order.findAll({
                    where: { Id_User: id },
                    include: [
                        {
                            model: db.Categori,
                            attributes: ['nameCategories', "ID_Service"],
                            include: [
                                {
                                    model: db.Service,
                                    attributes: ['nameService']
                                }
                            ]
                        }
                    ]
                });
                resolve({ success: true, message: "Lấy đơn đăng ký thành công", data: listOrder });
            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }

    async detailOrderService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await db.Order.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.Categori,
                            attributes: ['ID_Service']
                        }
                    ]
                });
                if (data.ID_Product) {
                    let data = await db.Order.findOne({
                        where: { id: id },
                        include: [
                            {
                                model: db.Product,
                                attributes: ['ID_Brand']
                            }
                        ]
                    })
                    // console.log("Co ID product", order)
                    resolve({ data })
                } else {
                    resolve({ data });
                    // console.log("Khong co id product", detailOrder)

                }
            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }

    async updateOrderService(id, idUser, fullName, address, phone, email, idCategori, idProduct, desRepair, dateRepair) {
        return new Promise(async (resolve, reject) => {
            try {
                let updateOrder = await db.Order.update({
                    ID_User: idUser,
                    ID_Categori: idCategori,
                    ID_Product: idProduct,
                    fullName: fullName,
                    address: address,
                    phone: phone,
                    email: email,
                    desProblem: desRepair,
                    desireDate: dateRepair,
                }, {
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Cập nhật đơn sửa chữa thành công" });
            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }

    async deleteOrderService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let existOrder = await db.Order.findOne({ where: { id: id } });
                if (existOrder && existOrder.status === 'W') {

                    let deleteOrder = await db.Order.destroy({ where: { id: id } })
                    resolve({ success: true, message: "Xóa đơn sửa chữa thành công" });
                }
                else {
                    resolve({ success: false, message: "Không thấy đơn sửa chữa" });
                }

            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }
}

module.exports = new OrderService();