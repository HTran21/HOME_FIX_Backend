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
                        ],
                        // status: {
                        //     [Op.ne]: 'D'
                        // }
                    },
                    attributes: [
                        ['id', 'id'],
                        ['usernameStaff', 'username'],
                        ['position', 'position'],
                        ['emailStaff', 'email'],
                        ['phoneStaff', 'phone'],
                        ['addressStaff', 'address'],
                        ['avatarStaff', 'avatar'],
                        ['role', 'role'],
                        ['status', 'status']
                    ]
                });
                const repairers = await db.Repairer.findAll({
                    where: {
                        [Op.or]: [
                            { usernameRepairer: { [Op.like]: `%${search}%` } },
                            { emailRepairer: { [Op.like]: `%${search}%` } },
                        ],
                        // status: {
                        //     [Op.ne]: 'D'
                        // }
                    },
                    attributes: [
                        ['id', 'id'],
                        ['usernameRepairer', 'username'],
                        ['position', 'position'],
                        ['emailRepairer', 'email'],
                        ['phoneRepairer', 'phone'],
                        ['addressRepairer', 'address'],
                        ['avatarRepairer', 'avatar'],
                        ['role', 'role'],
                        ['status', 'status']
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
                        ['role', 'role'],
                        ['status', 'status']
                    ],
                    // where: {
                    //     status: {
                    //         [Op.ne]: 'D'
                    //     }
                    // }
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
                        ['ID_Service', 'skill'],
                        ['status', 'status']
                    ],
                    // where: {
                    //     status: {
                    //         [Op.ne]: 'D'
                    //     }
                    // }
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

    async updateCustomer(req, res, next) {
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
                            const { username, email, phone, address } = req.body;
                            const avatar = req.file.originalname;
                            const updateUser = await db.User.update({
                                username: username,
                                email: email,
                                phone: phone,
                                address: address,
                                avatar: avatar
                            }, {
                                where: {
                                    id
                                }
                            })
                            return res.json({ success: true, message: "Cập nhật thông tin thành công" })

                        } else {
                            const { username, email, phone, address } = req.body;
                            const updateUser = await db.User.update({
                                username: username,
                                email: email,
                                phone: phone,
                                address: address,
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

    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            const existUser = await db.Repairer.findOne({
                where: {
                    id: id
                }
            })
            if (existUser) {
                let listSchedule = await db.Schedule.findAll({
                    where: {
                        ID_Repairer: id
                    },
                    raw: true
                })
                // console.log(listSchedule)
                if (listSchedule) {
                    let countRepair = 0;
                    for (const schedule of listSchedule) {
                        let existOrderForRepairer = await db.DetailOrder.findAll({
                            where: {
                                ID_Schedule: schedule.id,
                            },
                            include: [{
                                model: db.Order,
                                where: {
                                    status: 'A'
                                }
                            }],
                            raw: true
                        });

                        if (existOrderForRepairer.length !== 0) {
                            countRepair++;
                        }
                    }
                    if (countRepair > 0) {
                        return res.json({ success: false, message: "Không thể xóa người dùng" });
                    }
                    else {
                        await db.Repairer.update({
                            status: 'D'
                        }, {
                            where: {
                                id: id
                            }
                        })
                        return res.json({ success: true, message: "Xóa người dùng thành công" });
                    }
                }


            }
            else {
                return res.json({ success: false, message: "Không tìm thấy người dùng" });
            }



        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async deleteCustomer(req, res, next) {
        try {
            const id = req.params.id;
            const existUser = await db.User.findOne({
                where: {
                    id: id
                }
            })
            if (existUser) {
                let existOrderProcess = await db.Order.count({
                    where: {
                        ID_User: id,
                        status: 'A'
                    }
                })
                if (existOrderProcess > 0) {
                    return res.json({ success: false, message: "Xóa người dùng thất bại" })
                } else {
                    await db.User.update({
                        status: 'D'
                    }, {
                        where: {
                            id: id
                        }
                    })
                    return res.json({ success: true, message: "Xóa người dùng thành công" });
                }


            }
            else {
                return res.json({ success: false, message: "Không tìm thấy người dùng" });
            }



        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async getAllCustomer(req, res, next) {
        try {
            const search = req.query.search;
            if (search) {
                const listCustomer = await db.User.findAll({
                    where: {
                        [Op.or]: [
                            { username: { [Op.like]: `%${search}%` } },
                            { email: { [Op.like]: `%${search}%` } },
                        ],
                        status: {
                            [Op.ne]: 'D'
                        }
                    },
                    attributes: {
                        exclude: ['password']
                    },

                });
                let listFullInfoCustomerPromises = listCustomer.map(async item => {
                    let ID_User = item.id;
                    let countOrder = await db.Order.count({
                        where: {
                            ID_User: ID_User,
                            status: 'S'
                        }
                    })
                    return {
                        user: item,
                        totalOrder: countOrder
                    }
                });

                let listFullInfoCustomer = await Promise.all(listFullInfoCustomerPromises);
                return res.json({ success: true, message: "Danh sách khách hàng", listCustomer, listFullInfoCustomer });


            }
            else {
                let listCustomer = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                });
                let listFullInfoCustomerPromises = listCustomer.map(async item => {
                    let ID_User = item.id;
                    let countOrder = await db.Order.count({
                        where: {
                            ID_User: ID_User,
                            status: 'S'
                        }
                    })
                    return {
                        user: item,
                        totalOrder: countOrder
                    }
                });

                let listFullInfoCustomer = await Promise.all(listFullInfoCustomerPromises);
                return res.json({ success: true, message: "Danh sách khách hàng", listCustomer, listFullInfoCustomer });
            }
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