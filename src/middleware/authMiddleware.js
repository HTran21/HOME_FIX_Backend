const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, 'access_token', function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The user is not authentication'
            })
        }
        console.log("User", user)
        if (user.role === 'AD') {
            next()
        } else {
            return res.status(404).json({
                message: 'The user is not authentication'
            })
        }
    });
}

module.exports = authMiddleware