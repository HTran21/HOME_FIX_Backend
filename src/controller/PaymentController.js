const db = require('../app/models/index');
// const multer = require('multer');
// const storage = require("../middleware/upload_image");

const moment = require('moment');
const orderService = require('../services/orderService');
const { where } = require('sequelize');
const payementService = require('../services/payementService');
// const sortObject = require("../untils")

class PaymentController {
    async handleCreatePaymentVnpayUrl(req, res, next) {
        try {
            const detailOrder = req.detailOrder.detailOrder;

            let date = new Date();
            let createDate = moment(date).format("yyyyMMDDHHmmss");

            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let config = require('config');
            // let dateFormat = require('dateformat');


            let tmnCode = config.get('vnp_TmnCode');
            let secretKey = config.get('vnp_HashSecret');
            let vnpUrl = config.get('vnp_Url');
            let returnUrl = config.get('vnp_ReturnUrl');
            let orderId = moment(date).format("DDHHmmss");

            // var date = new Date();

            // var createDate = dateFormat(date, 'yyyymmddHHmmss');

            // var amount = req.body.amount;
            // var bankCode = req.body.bankCode;

            // var orderInfo = req.body.orderDescription;
            // var orderType = req.body.orderType;
            // var locale = req.body.language;
            // if (locale === null || locale === '') {
            //     locale = 'vn';
            // }
            let locale = "vn";
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params["vnp_Locale"] = locale;
            vnp_Params['vnp_TxnRef'] = detailOrder.id;
            vnp_Params['vnp_OrderInfo'] = "Thanh toan cho ma GD:" + detailOrder.id;
            vnp_Params['vnp_OrderType'] = "Thanh toan VNPAY";
            vnp_Params['vnp_Amount'] = detailOrder.totalAmount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            // if (bankCode !== null && bankCode !== '') {
            //     vnp_Params['vnp_BankCode'] = bankCode;
            // }

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            return res.status(200).json({
                success: true,
                message: "Đã tạo thanh toán",
                data: {
                    url: vnpUrl,
                },
            });
        }
        catch (e) {
            console.log(e);
            return res.json({ e });
        }

    }

    async vnpayReturn(req, res, next) {
        try {
            let config = require("config");
            let querystring = require("qs");
            let crypto = require("crypto");


            var vnp_Params = req.query;
            var secureHash = vnp_Params["vnp_SecureHash"];

            delete vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHashType"];

            vnp_Params = sortObject(vnp_Params);
            // console.log("RspCode", vnp_Params["vnp_ResponseCode"])

            var secretKey = config.get("vnp_HashSecret");

            var signData = querystring.stringify(vnp_Params, { encode: false });
            var hmac = crypto.createHmac("sha512", secretKey);
            var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
            // console.log("signed", signed);
            // console.log("vnp_ResponseCode", vnp_Params["vnp_ResponseCode"])
            if (secureHash === signed) {
                var orderId = vnp_Params["vnp_TxnRef"];
                var rspCode = vnp_Params["vnp_ResponseCode"];
                let paymentStatus = 'P';
                const updateDetailOrder = await orderService.updateStatusPayment(orderId, paymentStatus)
                if (updateDetailOrder.success) {
                    return res.json({
                        success: true,
                        message: "Đơn sửa chữa đã được thanh toán",
                        data: updateDetailOrder.existOrder,
                        payment: true
                    })
                }
                else {
                    return res.json({
                        success: false,
                        message: "Đơn sửa chữa đã bị xóa hoặc không tìm thấy.",
                        payment: true
                    });
                }

            }
            else {
                return res.json({
                    success: false,
                    message: "Đã có lỗi xãy ra. Dữ liệu đã bị thay đổi.",
                    payment: false
                });
            }

        }
        catch (e) {
            console.log(e);
            return res.json({ e });
        }
    }

    async handleCreatePaymentCash(req, res, next) {
        try {
            const ID_DetailOrder = req.body.ID_DetailOrder;
            const paymentMethod = req.body.paymentMethod;
            let existDetailOrder = await db.DetailOrder.findOne({
                where: {
                    id: ID_DetailOrder
                }
            })
            if (existDetailOrder) {
                await db.DetailOrder.update({
                    paymentMethod: paymentMethod,
                    paymentStatus: 'W'
                }, {
                    where: {
                        id: ID_DetailOrder
                    }
                })
                return res.json({ success: true, message: "Vui lòng chờ thợ xác nhận" })
            }
            else {
                return res.json({ success: false, message: "Không tìm thấy đơn hàng" })
            }
        }
        catch (e) {
            console.log(e);
            return res.json(e)
        }
    }

    async handleConfirmPayment(req, res, next) {
        try {
            const { ID_DetailOrder } = req.body;
            let data = await payementService.handleConfirmPayment(ID_DetailOrder)
            return res.json(data)
        }
        catch (e) {
            console.log(e);
            return res.json(e)
        }
    }

}



function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


module.exports = new PaymentController();