const db = require('../app/models/index');
const multer = require('multer');
const storage = require("../middleware/upload_image");
const userService = require("../services/userService");

class UserController {
    async test(req, res, next) {
        try {
            return res.send("User");
        }
        catch (e) {
            console.log(e)
        }

    }
    async getStaff(req, res, next) {
        try {
            let staffs = await db.Staff.findAll();
            return res.json(staffs);
        }
        catch (e) {
            console.log(e)
        }

    }

    async updateProfile(req, res, next) {
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
                    // res.cookie("token", "");
                    const avatar = req.file;
                    const { username, email, phone, address } = req.body;
                    let data = await userService.updateProfileService(id, avatar, username, email, phone, address)
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
            return res.json({ error });
        }
    }
}

module.exports = new UserController();