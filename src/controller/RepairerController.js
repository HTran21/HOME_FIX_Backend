const db = require('../app/models/index')
const multer = require('multer');
const repairerService = require("../services/repairerService");
const storage = require("../middleware/upload_image");
const { Op } = require('sequelize');
// const operationService = require("../services/operationService");
// const serviceService = require("../services/serviceService");

class RepairerController {

    async detailProfile(req, res, next) {
        try {
            const id = req.params.id;
            let data = await repairerService.detailProfile(id);
            try {
                return res.json(data)
            }
            catch (e) {
                console.log(e)
                return res.json(e)
            }
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async updateRepairer(req, res, next) {
        try {
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
                        res.cookie("token", "");
                        const avatar = req.file;
                        const { username, email, phone, address } = req.body;
                        let data = await repairerService.updateProfileService(id, avatar, username, email, phone, address)
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
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async getAllRepair(req, res, next) {
        try {
            let listRepairer = await db.Repairer.findAll({
                where: {
                    status: {
                        [Op.ne]: 'D'
                    }
                },
                attributes: {
                    exclude: ['passwordRepairer']
                },
                include: [{
                    model: db.Service
                }]
            });
            return res.json(listRepairer)
        }
        catch (e) {
            return res.status(400).json({ error: e });
        }
    }

}

module.exports = new RepairerController();