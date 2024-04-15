const db = require('../app/models/index');
const multer = require('multer');
const storage = require("../middleware/upload_image");
const userService = require("../services/userService");
const orderService = require('../services/orderService');
const { where } = require('sequelize');

class UserController {
    async test(req, res, next) {
        try {
            return res.send("User");
        }
        catch (e) {
            console.log(e)
        }

    }
    async getStaff(req, res, next) {
        try {
            let staffs = await db.Staff.findAll();
            return res.json(staffs);
        }
        catch (e) {
            console.log(e)
        }

    }

    async updateProfile(req, res, next) {
        try {
            res.cookie("token", "expired", { httpOnly: true });
            const upload = multer({ storage: storage }).single("avatar");
            const id = req.params.id;
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                }
                else {
                    // res.cookie("token", "");
                    const avatar = req.file;
                    const { username, email, phone, address } = req.body;
                    let data = await userService.updateProfileService(id, avatar, username, email, phone, address)
                    // console.log("data new", data.data.dataToken)
                    res.cookie("token", data.data.access_token, {
                        httpOnly: true,
                    })
                    return res.json(data);
                }
            })

        }
        catch (e) {
            console.log(e);
            return res.json({ e });
        }
    }

    async handleBooking(req, res, next) {
        try {
            const ID_DetailOrder = req.body.ID_DetailOrder;
            const paymentMethod = req.body.paymentMethod;

            if (paymentMethod !== "vnpay" && paymentMethod !== "cash") {
                return res.json({ success: false, message: "Dữ liệu về phương thức thanh toán không chính xác" })
            }
            let existDetail = await db.DetailOrder.findOne({ where: { id: ID_DetailOrder } })
            if (existDetail) {
                await db.DetailOrder.update({
                    paymentMethod: paymentMethod
                }, {
                    where: {
                        id: ID_DetailOrder
                    }
                })
                let data = await orderService.getConfirmOrderService(ID_DetailOrder)
                req.detailOrder = data;
                next();
            } else {
                return res.json({ success: false, message: "Không tìm thấy đơn hàng" })
            }

        }
        catch (error) {
            console.log(error)
            return res.json({ success: false, message: "Đã xảy ra lỗi khi xử lý yêu cầu thanh toán" });
        }
    }
}

module.exports = new UserController();