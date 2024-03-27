const db = require('../app/models/index')
const multer = require('multer');
const repairerService = require("../services/repairerService");
const storage = require("../middleware/upload_image");
// const operationService = require("../services/operationService");
// const serviceService = require("../services/serviceService");

class RepairerController {
    async updateRepairer(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single('avatar');

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                } else {
                    try {

                        const id = req.params.id;
                        const file = req.file;
                        if (file) {
                            const { username, position, email, phone, address, specialize } = req.body;
                            const avatar = req.file.originalname;
                            const updateUser = await db.Repairer.update({
                                usernameRepairer: username,
                                position: position,
                                emailRepairer: email,
                                phoneRepairer: phone,
                                addressRepairer: address,
                                avatarRepairer: avatar
                            }, {
                                where: {
                                    id
                                }
                            })
                            return res.json({ success: true, message: "Cập nhật thông tin thành công" })

                        } else {
                            const { username, position, email, phone, address, specialize } = req.body;
                            const updateUser = await db.Repairer.update({
                                usernameRepairer: username,
                                position: position,
                                emailRepairer: email,
                                phoneRepairer: phone,
                                addressRepairer: address,
                            }, {
                                where: {
                                    id
                                }
                            })
                            return res.json({ success: true, message: "Cập nhật thông tin thành công" })

                        }
                        // let data = await repairerService.updateREpairer(username, password, position, email, avatar, phone, address, specialize)
                        // return res.json(data);


                    }
                    catch (error) {
                        console.log(error)
                        return res.json(error);
                    }

                }
            })
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }



        }
    }

}

module.exports = new RepairerController();