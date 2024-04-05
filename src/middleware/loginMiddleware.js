const jwt = require("jsonwebtoken");
const loginMiddleware = (req, res, next) => {
    const token = req.headers.cookie.split("token=")[1];
    if (token) {
        next();
    }
    else {
        return res.json({ success: false, message: "Người dùng chưa đăng nhập" })
    }
}

module.exports = loginMiddleware