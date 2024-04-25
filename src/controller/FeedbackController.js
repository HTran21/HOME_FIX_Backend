const db = require('../app/models/index')
const multer = require('multer');
const feedbackService = require("../services/feedbackService");
const storage = require("../middleware/upload_image");
const { Op } = require('sequelize');
// const operationService = require("../services/operationService");
// const serviceService = require("../services/serviceService");

class FeedbackController {

    async getAllFeedback(req, res, next) {
        try {
            let data = await feedbackService.getAllFeedbackService()
            return res.json(data)

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async getByUser(req, res, next) {
        try {
            let ID_User = req.query.ID_User;
            let role = req.query.role;
            let data = await feedbackService.getByUserService(ID_User, role)
            return res.json(data)

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async createFeedback(req, res, next) {
        try {
            let data = await feedbackService.createFeedbackService(req.body)
            return res.json(data)

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

}

module.exports = new FeedbackController();