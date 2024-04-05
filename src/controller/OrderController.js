// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const orderService = require("../services/orderService");

class OrderController {

    async createOrder(req, res, next) {
        try {
            const { idUser, fullName, address, phone, email, idCategori, idProduct, desRepair, dateRepair } = req.body;
            const status = 'W';
            let data = await orderService.createOrderService(idUser, fullName, address, phone, email, idCategori, idProduct, desRepair, dateRepair, status);
            return res.json(data);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async getOrderUser(req, res, next) {
        try {
            const id = req.params.id;
            let data = await orderService.getOrderUserService(id);
            return res.json(data);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async detailOrder(req, res, next) {
        try {
            const id = req.params.id;
            let data = await orderService.detailOrderService(id);
            return res.json({ data })
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async updateOrder(req, res, next) {
        try {
            const { idUser, fullName, address, phone, email, idCategori, idProduct, desRepair, dateRepair } = req.body;
            const id = req.params.id;
            let data = await orderService.updateOrderService(id, idUser, fullName, address, phone, email, idCategori, idProduct, desRepair, dateRepair);
            return res.json({ data });
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async deleteOrder(req, res, next) {
        const id = req.params.id;
        let data = await orderService.deleteOrderService(id);
        return res.json({ data })
    }
}

module.exports = new OrderController();