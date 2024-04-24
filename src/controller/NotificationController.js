const db = require('../app/models/index')
const multer = require('multer');
const notificationService = require("../services/notificationService");
const storage = require("../middleware/upload_image");
const { Op } = require('sequelize');
// const operationService = require("../services/operationService");
// const serviceService = require("../services/serviceService");

class Notification {


    async getNotification(req, res, next) {
        try {
            const ID_User = req.query.ID_User;
            const role = req.query.role;
            let data = await notificationService.getNotificationService(ID_User, role)
            return res.json(data)

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async changeReadNotification(req, res, next) {
        try {
            let listNotification = req.body.listNotificationUnRead;
            let data = await notificationService.changeReadNotificationService(listNotification);
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

module.exports = new Notification();