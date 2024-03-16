// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const operationService = require("../services/operationService");
const serviceService = require("../services/serviceService");

class OperationController {

    async getOperation(req, res, next) {
        try {
            let data = await serviceService.getBlogService();
            return res.json(data);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async createOperation(req, res, next) {
        try {
            console.log("Operation", req.body);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }

        }
    }
}

module.exports = new OperationController();