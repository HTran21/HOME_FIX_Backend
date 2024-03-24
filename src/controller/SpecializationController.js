const db = require('../app/models/index')
const multer = require('multer');
const storage = require("../middleware/upload_image");
const { where } = require('sequelize');

class Specialization {

    async getSpecialize(req, res, next) {
        try {
            const data = await db.Specialization.findAll();
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e });
        }
    }

    async addSpecialize(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single('imageSpecialize');

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                } else {
                    const imageSpecialize = req.file.originalname;
                    const { nameSpecialize, desSpecialize } = req.body;
                    let existSpecialize = await db.Specialization.findOne({ where: { nameSpecialization: nameSpecialize } });
                    if (!existSpecialize) {
                        let newSpecialize = await db.Specialization.create({
                            nameSpecialization: nameSpecialize,
                            logoSpecialization: imageSpecialize,
                            desSpecialization: desSpecialize
                        })
                        return res.json({ success: true, message: "Tạo chuyên môn thành công" })

                    }
                    else {
                        return res.json({ success: false, message: "Chuyên môn đã tồn tại" })
                    }

                }
            })
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }


            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateSpecialize(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single('imageSpecializeEidt');
            const id = req.params.id;
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                } else {
                    if (req.file) {
                        const imageSpecialize = req.file.originalname;
                        const { nameSpecializeEidt, desSpecializeEdit } = req.body;
                        let updateSpecialization = await db.Specialization.update({
                            nameSpecialization: nameSpecializeEidt,
                            logoSpecialization: imageSpecialize,
                            desSpecialization: desSpecializeEdit
                        }, {
                            where: {
                                id: id
                            }
                        })
                        return res.json({ success: true, message: "Cập nhật chuyên môn thành công" })

                    }
                    else {
                        const { nameSpecializeEidt, desSpecializeEdit } = req.body;
                        let updateSpecialization = await db.Specialization.update({
                            nameSpecialization: nameSpecializeEidt,
                            desSpecialization: desSpecializeEdit
                        }, {
                            where: {
                                id: id
                            }
                        })
                        return res.json({ success: true, message: "Cập nhật chuyên môn thành công" })
                    }


                }
            })
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteSpecialize(req, res, next) {
        try {
            const id = req.params.id;
            let deleteSpecialization = await db.Specialization.destroy({
                where: {
                    id: id
                }
            })
            return res.json({ success: true, message: "Đã xóa chuyên môn" });
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

}

module.exports = new Specialization();