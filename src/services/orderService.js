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




}

module.exports = new OrderService();