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

    async fullDetailOrder(req, res, next) {
        try {
            const ID_Order = req.params.id;
            let data = await orderService.fullDetailOrderService(ID_Order);
            return res.json(data)
        }
        catch (e) {
            console.log(e)

            if (e) {
                return res.json(e);
            }
        }
    }

    async listTaskOrder(req, res, next) {
        try {
            const ID_OrderDetail = req.params.id;
            const { totalAmount, listTask } = req.body;
            let data = await orderService.listTaskOrderService(ID_OrderDetail, totalAmount, listTask)
            return res.json(data)
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.json(e)
            }
        }
    }

    async detailListTaskOrder(req, res, next) {
        try {
            const ID_DetailOrder = req.params.id;
            let data = await orderService.detailListTaskOrderService(ID_DetailOrder)
            return res.json(data)

        } catch (e) {
            console.log(e);
            if (e) {
                return res.json(e)
            }
        }

    }

    async updateTaskOrder(req, res, next) {
        try {
            const ID_DetailOrder = req.params.id;
            const ID_Operation = req.body.operation;
            const totalAmount = req.body.total;
            let data = await orderService.updateTaskOrderService(ID_DetailOrder, ID_Operation, totalAmount)
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.json(e)
            }
        }
    }

    async deleteTaskOrder(req, res, next) {
        try {
            const ID_TaskRepair = req.params.id;
            let data = await orderService.deleteTaskOrderService(ID_TaskRepair)
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.json(e)
            }
        }
    }


    async updateStatusOrder(req, res, next) {
        try {
            const ID_Order = req.params.id;
            const status = req.body.status;
            let data = await orderService.updateStatusOrderService(ID_Order, status)
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            if (e) {
                return res.json(e)
            }
        }
    }




}

module.exports = new OrderController();