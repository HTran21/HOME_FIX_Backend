const db = require('../app/models/index')
const multer = require('multer');
const storage = require("../middleware/upload_image");
const adminService = require('../services/adminService');
const { Op } = require('sequelize');

class AdminController {

    async getAllUser(req, res, next) {
        try {
            const search = req.query.search;
            if (search) {
                const staffs = await db.Staff.findAll({
                    where: {
                        [Op.or]: [
                            { usernameStaff: { [Op.like]: `%${search}%` } },
                            { emailStaff: { [Op.like]: `%${search}%` } },
                        ]
                    },
                    attributes: [
                        ['id', 'id'],
                        ['usernameStaff', 'username'],
                        ['position', 'position'],
                        ['emailStaff', 'email'],
                        ['phoneStaff', 'phone'],
                        ['addressStaff', 'address'],
                        ['avatarStaff', 'avatar'],
                        ['role', 'role']
                    ]
                });
                const repairers = await db.Repairer.findAll({
                    where: {
                        [Op.or]: [
                            { usernameRepairer: { [Op.like]: `%${search}%` } },
                            { emailRepairer: { [Op.like]: `%${search}%` } },
                        ]
                    },
                    attributes: [
                        ['id', 'id'],
                        ['usernameRepairer', 'username'],
                        ['position', 'position'],
                        ['emailRepairer', 'email'],
                        ['phoneRepairer', 'phone'],
                        ['addressRepairer', 'address'],
                        ['avatarRepairer', 'avatar'],
                        ['role', 'role']
                    ]
                });

                const users = staffs.concat(repairers);
                return res.json({ users })


            }
            else {
                const staffs = await db.Staff.findAll({
                    attributes: [
                        ['id', 'id'],
                        ['usernameStaff', 'username'],
                        ['position', 'position'],
                        ['emailStaff', 'email'],
                        ['phoneStaff', 'phone'],
                        ['addressStaff', 'address'],
                        ['avatarStaff', 'avatar'],
                        ['role', 'role']
                    ]
                });
                const repairers = await db.Repairer.findAll({
                    attributes: [
                        ['id', 'id'],
                        ['usernameRepairer', 'username'],
                        ['position', 'position'],
                        ['emailRepairer', 'email'],
                        ['phoneRepairer', 'phone'],
                        ['addressRepairer', 'address'],
                        ['avatarRepairer', 'avatar'],
                        ['role', 'role'],
                        ['ID_Speliciazation', 'skill']
                    ]
                });

                const users = staffs.concat(repairers);
                return res.json({ users });
            }

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async addService(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single('logoService');

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                } else {
                    const url = req.file.originalname;
                    const { nameService, contentHTML, contentMarkdown } = req.body;
                    try {
                        let data = await adminService.postService(nameService, contentHTML, contentMarkdown, url)
                        return res.json(data);
                    }
                    catch (error) {
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


            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async createRepairer(req, res, next) {
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

                        const avatar = req.file.originalname;
                        const { username, password, position, email, phone, address, specialize } = req.body;
                        const role = 'RP';
                        const status = 'Y'
                        let data = await adminService.createStaffService(username, password, position, email, avatar, phone, address, specialize, role, status)
                        return res.json(data);
                    }
                    catch (error) {
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

    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            // Kiểm tra thợ có đơn sửa chữa

            let deleteUser = await db.Repairer.destroy({
                where: {
                    id: id
                }
            })
            return res.json({ success: true, message: "Đã xóa người dùng" });

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }



}

module.exports = new AdminController();