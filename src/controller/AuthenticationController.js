const db = require('../app/models/index')
const AuthenticationService = require("../services/authenService");
const multer = require('multer');
const storage = require("../middleware/upload_image")

const jwt = require("jsonwebtoken");

class AuthenticationController {
    async test(req, res, next) {
        try {
            let data = await db.Staff.findAll();
            console.log("Data", data);
            return res.json(data)
        }
        catch (e) {
            console.log(e)
        }

    }

    async getProfile(req, res) {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.json("Nguoi dung ch dang nhap");
            }
            const dataUser = jwt.verify(token, 'access_token');
            return res.status(200).json(dataUser);
        } catch (err) {
            // console.log("err <<< ", err);
            // return res.status(500).json({ err: err });
            if (err instanceof jwt.TokenExpiredError) {
                // Token đã hết hạn, thông báo cho người dùng
                return res.status(401).json({ message: 'Token has expired' });
            } else {
                // Xử lý các lỗi khác
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    }


    async registerStaff(req, res, next) {
        try {
            const { usernameStaff, passwordStaff, position, emailStaff, phoneStaff, addressStaff } = req.body;
            const role = "AD";
            const status = "Y";
            console.log("Data", req.body);
            let data = await AuthenticationService.registerServiceStaff(usernameStaff, passwordStaff, position, emailStaff, phoneStaff, addressStaff, role, status);
            return res.json(data);

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }


            return res.status(500).json({ error: "Internal Server Error" });
        }

    }
    async register(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single("avatar");

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                }
                else {

                    const url = req.file.originalname;
                    const { username, password, email, phone, address, avatar } = req.body;

                    var role = 'KH';
                    var status = 'Y';
                    try {
                        let data = await AuthenticationService.registerService(username, password, email, phone, address, url, role, status);

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

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const data = await AuthenticationService.loginService(email, password);
            res.cookie("token", data.data.access_token, {
                httpOnly: true,
            })
            return res.json(data);

        }
        catch (e) {
            // console.error("Loi", e);
            if (e) {
                return res.json({ error: e });
            }

            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async loginStaff(req, res, next) {
        try {
            const { email, password } = req.body;
            console.log(req.body)
            const data = await AuthenticationService.loginServiceStaff(email, password);
            return res.json(data);

        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }

            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async logout(req, res, next) {
        try {
            res.cookie("token", "");
            return res
                .status(200)
                .json({ success: true, message: "Logout successful" });
        } catch (err) {
            return res.status(500).json({ message: "Error logout.", err: err.message });
        }
    }
}

module.exports = new AuthenticationController();