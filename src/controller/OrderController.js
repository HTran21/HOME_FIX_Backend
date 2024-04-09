// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const orderService = require("../services/orderService");

class OrderController {

    async getAllOrder(req, res, next) {
        try {
            let data = await orderService.getAllOrderService();
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

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
        try {
            const id = req.params.id;
            let data = await orderService.deleteOrderService(id);
            return res.json({ data })
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.json(e);
            }
        }

    }
    async deniedOrder(req, res, next) {
        try {
            const id = req.params.id;
            let data = await orderService.deniedOrderService(id);
            return res.json({ data })
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.json(e)
            }
        }

    }

    async acceptOrder(req, res, next) {
        try {
            // console.log("ID_Repair", req.params.id);
            // console.log("body", req.body);
            const ID_Repair = req.params.id;
            const { idSchedule, timeslot } = req.body;
            let data = await orderService.acceptOrderService(ID_Repair, idSchedule, timeslot)
            return res.json(data)
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.json(e);
            }
        }
    }


}

module.exports = new OrderController();