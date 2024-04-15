const db = require('../app/models/index');
const { Op, where } = require('sequelize');
// const { deleteOrder } = require('../controller/OrderController');
const nodemailer = require("nodemailer");
const moment = require('moment');

class OrderService {

    async getAllOrderService() {
        return new Promise(async (resolve, reject) => {
            try {
                let listOrder = await db.Order.findAll({
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
                        },
                        {
                            model: db.DetailOrder,

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
                            attributes: ['ID_Service', 'nameCategories'],
                            include: [
                                {
                                    model: db.Service,
                                    attributes: ['nameService']
                                }
                            ]
                        }
                    ]
                });
                if (data.ID_Product) {
                    let data = await db.Order.findOne({
                        where: { id: id },
                        include: [
                            {
                                model: db.Product,
                                attributes: ['ID_Brand', 'nameProduct'],
                                include: [{
                                    model: db.Brand,
                                    attributes: ['nameBrand']
                                }]
                            },
                            {
                                model: db.Categori,
                                attributes: ['ID_Service', 'nameCategories'],
                                include: [{
                                    model: db.Service,
                                    attributes: ['nameService']
                                }]
                            },
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

    async deniedOrderService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let existOrder = await db.Order.findOne({ where: { id: id } });
                if (existOrder && existOrder.status === 'W') {

                    let deniedOrder = await db.Order.update(
                        {
                            status: 'C'
                        },
                        {
                            where: {
                                id: id
                            }
                        }
                    )
                    resolve({ success: true, message: "Xóa đơn sửa chữa thành công" });
                }
                else {
                    resolve({ success: false, message: "Không thể từ chối đơn sửa chữa" });
                }

            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }



    async acceptOrderService(ID_Repair, idSchedule, timeslot) {
        return new Promise(async (resolve, reject) => {
            try {
                let detailOrder = await this.detailOrderService(ID_Repair);

                let updateOrder = await db.Order.update({
                    status: 'A',
                }, {
                    where: { id: ID_Repair }
                })

                let newDetailOrder = await db.DetailOrder.create({
                    ID_Order: ID_Repair,
                    ID_Schedule: idSchedule,
                    timeRepair: timeslot,
                })

                let repairer = await db.Schedule.findOne({
                    where: {
                        id: idSchedule
                    },
                    attributes: ['workDay'],
                    include: [{
                        model: db.Repairer,
                        attributes: ['usernameRepairer', 'emailRepairer', 'phoneRepairer']
                    }]
                })

                // console.log("Tho", repairer.Repairer.usernameRepairer)

                const emailCustomer = detailOrder.data.email;
                const emailRepairer = repairer.Repairer.emailRepairer;

                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "tranhoangtran22226@gmail.com",
                        pass: "fjwn cylp iemu hupx",
                    },
                });

                const htmlContent = `<section style="width: 100%; background-color: rgba(232, 232, 232, 0.8);">
                                    <div style="width: 500px; margin: auto; background-color: #fff; padding: 10px;">
                                        <div >
                                            <div style="text-align: center">
                                               <h1>ĐƠN SỬA CHỮA HOMEFIX</h1>
                                            </div>
                                            <div">
                                                <h3>Thông tin khách hàng</h3>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Họ và tên: </span>${detailOrder.data.fullName}</p>
                                                </div>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Địa chỉ: </span>${detailOrder.data.address}</p>
                                                </div>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Số điện thoại: </span>${detailOrder.data.phone}</p>
                                                </div>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Email: </span>${detailOrder.data.email}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div>
                                                <h3>Dịch vụ mong muốn</h3>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Dịch vụ: </span>${detailOrder.data.Categori.Service.nameService}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div>
                                                <h3>Thông tin thiết bị</h3>
                                                <div class="row">
                                                    <div>
                                                        <p style="font-size: 14px;"><span style="font-weight: bold;">Nhãn hàng: </span>${detailOrder.data.ID_Product && detailOrder.data.Product.Brand.nameBrand ? detailOrder.data.Product.Brand.nameBrand : ''}</p>
                                                    </div>
                                                    <div>
                                                        <p style="font-size: 14px;"><span style="font-weight: bold;">Loại thiết bị: </span>${detailOrder.data.Categori.nameCategories}</p>
                                                    </div>
                                                    <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Thiết bị: </span>${detailOrder.data.ID_Product && detailOrder.data.Product.nameProduct ? detailOrder.data.Product.nameProduct : ''}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                            <div class="row">
                                                <h3>Thời gian sửa chữa</h3>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Ngày sửa chữa: </span>${moment(repairer.workDay).format('DD-MM-YYYY')}</p>
                                                </div>
                                                <div>
                                                <p style="font-size: 14px;"><span style="font-weight: bold;">Thời gian dự kiến: </span>${timeslot}</p>
                                            </div>
                                            </div>
                                            <hr />
                                            <div>
                                                <h3>Thông tin thợ</h3>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Họ và tên: </span>${repairer.Repairer.usernameRepairer}</p>
                                                </div>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Số điện thoại: </span>${repairer.Repairer.phoneRepairer}</p>
                                                </div>
                                                <div>
                                                    <p style="font-size: 14px;"><span style="font-weight: bold;">Email: </span>${repairer.Repairer.emailRepairer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                    </section>

                //         `

                await transporter.sendMail({
                    from: "tranhoangtran22226@gmail.com",
                    to: emailCustomer,
                    subject: "HOMEFIX - Thông Báo Xác Nhận Đơn Sửa Chữa",
                    html: htmlContent,
                });

                await transporter.sendMail({
                    from: "tranhoangtran22226@gmail.com",
                    to: emailRepairer,
                    subject: "HOMEFIX - Nhận Công Việc Sửa Chữa",
                    html: htmlContent,
                });

                resolve({ success: true, message: `Đã gửi mail thành công cho tài khoản ${emailCustomer} và ${emailRepairer}` })


                //     await transporter.sendMail({
                //         from: "tranhoangtran22226@gmail.com",
                //         to: `${emailCustomer}`,
                //         subject: "HOMEFIX - Thông Báo Xác Nhận Đơn Sửa Chữa",
                //         text: "Thời gian sửa chữa",
                //         html: `<section style="width: 100%; background-color: rgba(232, 232, 232, 0.8);">
                //                     <div style="width: 500px; margin: auto; background-color: #fff; padding: 10px;">
                //                         <div >
                //                             <div style="text-align: center">
                //                                <h1>ĐƠN SỬA CHỮA HOMEFIX</h1>
                //                             </div>
                //                             <div">
                //                                 <h3>Thông tin khách hàng</h4>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Họ và tên: </span>${detailOrder.data.fullName}</p>
                //                                 </div>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Địa chỉ: </span>${detailOrder.data.address}</p>
                //                                 </div>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Số điện thoại: </span>${detailOrder.data.phone}</p>
                //                                 </div>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Email: </span>${detailOrder.data.email}</p>
                //                                 </div>
                //                             </div>
                //                             <hr />
                //                             <div>
                //                                 <h4>Dịch vụ mong muốn</h4>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Dịch vụ: </span>${detailOrder.data.Categori.Service.nameService}</p>
                //                                 </div>
                //                             </div>
                //                             <hr />
                //                             <div>
                //                                 <h4>Thông tin thiết bị</h4>
                //                                 <div class="row">
                //                                     <div>
                //                                         <p style="font-size: 14px;"><span style="font-weight: bold;">Nhãn hàng: </span>${detailOrder.data.ID_Product && detailOrder.data.Product.Brand.nameBrand ? detailOrder.data.Product.Brand.nameBrand : ''}</p>
                //                                     </div>
                //                                     <div>
                //                                         <p style="font-size: 14px;"><span style="font-weight: bold;">Loại thiết bị: </span>${detailOrder.data.Categori.nameCategories}</p>
                //                                     </div>
                //                                     <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Thiết bị: </span>${detailOrder.data.ID_Product && detailOrder.data.Product.nameProduct ? detailOrder.data.Product.nameProduct : ''}</p>
                //                                     </div>
                //                                 </div>
                //                             </div>
                //                             <hr />
                //                             <div class="row">
                //                                 <h4>Thời gian sửa chữa</h4>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Ngày sửa chữa: </span>${selectDay}</p>
                //                                 </div>
                //                                 <div>
                //                                 <p style="font-size: 14px;"><span style="font-weight: bold;">Thời gian dự kiến: </span>${timeslot}</p>
                //                             </div>
                //                             </div>
                //                             <hr />
                //                             <div>
                //                                 <h4>Thông tin thợ</h4>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Họ và tên: </span>${repairer.usernameRepairer}</p>
                //                                 </div>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Số điện thoại: </span>${repairer.phoneRepairer}</p>
                //                                 </div>
                //                                 <div>
                //                                     <p style="font-size: 14px;"><span style="font-weight: bold;">Email: </span>${repairer.emailRepairer}</p>
                //                                 </div>
                //                             </div>
                //                         </div>
                //                     </div>
                //     </section>

                //         `
                //     },
                //         (err) => {
                //             if (err) {
                //                 resolve(err)
                //             }
                //             else {
                //                 resolve({ success: true, message: `Đã gửi mail thành công cho tài khoản ${emailCustomer}` })
                //             }
                //         })
            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }

    async fullDetailOrderService(ID_OrderDetail) {
        return new Promise(async (resolve, reject) => {
            try {

                let exsitDetailOrder = await db.DetailOrder.findOne({
                    where: {
                        id: ID_OrderDetail,

                    },
                    include: [{
                        model: db.Order,
                        include: [{
                            model: db.Product,
                            include: [{
                                model: db.Brand
                            }]
                        }, {
                            model: db.Categori,
                            include: [{
                                model: db.Service
                            }]
                        }]
                    },
                    {
                        model: db.Schedule,
                        include: [{
                            model: db.Repairer
                        }]
                    }]
                })

                if (exsitDetailOrder) {
                    resolve({ success: true, exsitDetailOrder })
                }
                else {
                    resolve({ success: false, message: "Không tìm thấy đơn hàng" })
                }

                // let data = await db.DetailOrder.findOne({
                //     where: {
                //         id: ID_OrderDetail
                //     },
                //     include: [{
                //         model: db.Order,
                //         include: [{
                //             model: db.Categori,
                //             attributes: ['nameCategories'],
                //             include: [{
                //                 model: db.Service,
                //                 attributes: ['nameService']
                //             }]
                //         }]

                //     },
                //     {
                //         model: db.Schedule,
                //         include: [{
                //             model: db.Repairer,
                //             attributes: ['usernameRepairer']
                //         }]
                //     }]
                // })
                // if (data.Order.ID_Product) {
                //     let data = await db.DetailOrder.findOne({
                //         where: {
                //             ID_Order: ID_Order
                //         },
                //         include: [{
                //             model: db.Order,
                //             include: [
                //                 {
                //                     model: db.Product,
                //                     attributes: ['ID_Brand', 'nameProduct'],
                //                     include: [{
                //                         model: db.Brand,
                //                         attributes: ['nameBrand']
                //                     }]
                //                 },
                //                 {
                //                     model: db.Categori,
                //                     attributes: ['nameCategories'],
                //                     include: [{
                //                         model: db.Service,
                //                         attributes: ['nameService']
                //                     }]
                //                 }]

                //         }, {
                //             model: db.Schedule,
                //             include: [{
                //                 model: db.Repairer,
                //                 attributes: ['usernameRepairer']
                //             }]
                //         }]
                //     })
                //     resolve(data)
                // }
                // else {
                //     resolve(data)
                // }

                // let data = await db.Order.findOne({
                //     where: { id: ID_Order },
                //     include: [
                //         {
                //             model: db.Categori,
                //             attributes: ['ID_Service', 'nameCategories'],
                //             include: [
                //                 {
                //                     model: db.Service,
                //                     attributes: ['nameService']
                //                 }
                //             ]
                //         }, {
                //             model: db.OrderDetail,

                //         }
                //     ]
                // });
                // if (data.ID_Product) {
                //     let data = await db.Order.findOne({
                //         where: { id: ID_Order },
                //         include: [
                //             {
                //                 model: db.Product,
                //                 attributes: ['ID_Brand', 'nameProduct'],
                //                 include: [{
                //                     model: db.Brand,
                //                     attributes: ['nameBrand']
                //                 }]
                //             },
                //             {
                //                 model: db.Categori,
                //                 attributes: ['ID_Service', 'nameCategories'],
                //                 include: [{
                //                     model: db.Service,
                //                     attributes: ['nameService']
                //                 }]
                //             },
                //         ]
                //     })
                //     // console.log("Co ID product", order)
                //     resolve({ data })
                // } else {
                //     resolve({ data });
                //     // console.log("Khong co id product", detailOrder)

                // }
            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }

    async listTaskOrderService(ID_DetailOrder, totalAmount, listTask) {
        return new Promise(async (resolve, reject) => {
            try {

                for (const task of listTask) {
                    let createTaskReapir = await db.TaskRepair.create({
                        ID_DetailOrder: ID_DetailOrder,
                        ID_Operation: task.id
                    })
                }

                const updatePayment = await db.DetailOrder.update({
                    totalAmount: totalAmount,
                    paymentStatus: 'UP'
                }, {
                    where: { id: ID_DetailOrder }
                })

                const detailOrder = await db.DetailOrder.findOne({ where: { id: ID_DetailOrder } })
                if (detailOrder) {
                    const order = await db.Order.findOne({
                        where: { id: detailOrder.ID_Order }
                    });
                    if (order) {
                        await db.Order.update({ status: 'S' }, { where: { id: order.id } });
                        resolve({ success: true, message: "Đã tạo danh sách thao tác thành công" })

                    }
                    else {
                        resolve({ success: false, message: "Không tìm thấy đơn hàng" });
                    }

                } else {
                    resolve({ success: false, message: "Không tìm thấy chi tiết đơn hàng" });
                }


            }
            catch (error) {
                console.log("Lỗi", error);
                reject(error)
            }

        })
    }

    async detailListTaskOrderService(ID_DetailOrder) {
        return new Promise(async (resolve, reject) => {
            try {
                let listTask = await db.DetailOrder.findOne({
                    where: {
                        id: ID_DetailOrder
                    },
                    include: [{
                        model: db.TaskRepair,
                        where: {
                            ID_DetailOrder: ID_DetailOrder
                        },
                        include: [{
                            model: db.Operation,
                            include: [{
                                model: db.Categori
                            }]
                        }]
                    }, {
                        model: db.Order,
                    }]
                })
                resolve(listTask)
            }
            catch (error) {
                console.log("Lỗi", error)
                reject(error)
            }
        })
    }

    async updateTaskOrderService(ID_DetailOrder, ID_Operation, totalAmount) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.TaskRepair.create({
                    ID_DetailOrder: ID_DetailOrder,
                    ID_Operation: ID_Operation
                })
                await db.DetailOrder.update({
                    totalAmount: totalAmount
                }, {
                    where: { id: ID_DetailOrder }
                })
                resolve({ success: true, message: "Đã cập nhật thao tác vào đơn sửa chữa" })
            }
            catch (error) {
                console.log("Lỗi", error)
                reject(error)
            }
        })
    }

    async deleteTaskOrderService(ID_TaskRepair) {
        return new Promise(async (resolve, reject) => {
            try {
                let taskRepair = await db.TaskRepair.findOne({
                    where: {
                        id: ID_TaskRepair
                    },
                    include: [{
                        model: db.Operation
                    }]
                })
                let priceOperation = taskRepair.Operation.price;
                if (taskRepair) {
                    let ID_DetailOrder = taskRepair.ID_DetailOrder;
                    let detailOrder = await db.DetailOrder.findOne({
                        where: {
                            id: ID_DetailOrder
                        }
                    })
                    if (detailOrder) {
                        let totalBefore = detailOrder.totalAmount;
                        let currentTotal = totalBefore - priceOperation;
                        await db.DetailOrder.update({
                            totalAmount: currentTotal
                        }, {
                            where: {
                                id: ID_DetailOrder
                            }
                        })
                        await db.TaskRepair.destroy({
                            where: {
                                id: ID_TaskRepair
                            }
                        })
                        resolve({ success: true, message: "Xóa thao tác đã thực hiện" })
                    } else {
                        resolve({ success: false, message: "Không tìm chi tiết đơn sửa chữa" })
                    }
                }
                else {
                    resolve({ success: false, message: "Không tìm thấy thao tác đã thực hiện" })
                }

            }
            catch (error) {
                console.log("Lỗi", error)
                reject(error)
            }
        })
    }

    async updateStatusOrderService(ID_Order, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let existOrder = await db.Order.findOne({ where: { id: ID_Order } });
                if (existOrder) {
                    let order = await db.Order.update({
                        status: status
                    }, {
                        where: {
                            id: ID_Order
                        }
                    })
                    resolve({ success: true, message: "Cập nhật trạng thái thành công" })
                } else {
                    resolve({ success: false, message: "Không tìm thấy đơn sửa chữa" });
                }

            }
            catch (error) {
                console.log("Lỗi", error)
                reject(error)
            }
        })
    }

    async getConfirmOrderService(ID_DetailOrder) {
        return new Promise(async (resolve, reject) => {
            try {
                let existOrder = await db.DetailOrder.findOne({ where: { id: ID_DetailOrder } });
                if (existOrder) {
                    let detailOrder = await db.DetailOrder.findOne({
                        where: {
                            id: ID_DetailOrder
                        },
                        include: [
                            {
                                model: db.Order,
                                include: [{
                                    model: db.Categori,
                                    include: [{
                                        model: db.Service
                                    }]
                                }, {
                                    model: db.Product,
                                    include: [{
                                        model: db.Brand
                                    }]
                                }]
                            }, {
                                model: db.Schedule,
                                include: [{
                                    model: db.Repairer
                                }]
                            }, {
                                model: db.TaskRepair,
                                include: [{
                                    model: db.Operation
                                }]
                            }
                        ]
                    });
                    resolve({ success: true, message: "Tìm thấy chi tiết đơn sửa chữa", detailOrder })

                } else {
                    resolve({ success: false, message: "Không tìm thấy chi tiết đơn sửa chữa" });
                }

            }
            catch (error) {
                console.log("Lỗi", error)
                reject(error)
            }
        })
    }

    async updateStatusPayment(ID_DetailOrder, paymentStatus) {
        return new Promise(async (resolve, reject) => {
            try {
                let existOrder = await db.DetailOrder.findOne({ where: { id: ID_DetailOrder } });
                if (existOrder) {
                    await db.DetailOrder.update({
                        paymentStatus: paymentStatus
                    }, {
                        where: {
                            id: ID_DetailOrder
                        }
                    })
                    resolve({ success: true, existOrder })
                } else {
                    resolve({ success: false, message: "Không tìm thấy đơn chi tiết sửa chữa" });
                }

            }
            catch (error) {
                console.log("Lỗi", error)
                reject(error)
            }
        })
    }



}

module.exports = new OrderService();