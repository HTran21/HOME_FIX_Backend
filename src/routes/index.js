const authentication = require("./authentication");
const user = require("./user");
const admin = require("./admin");
const blog = require("./blog")
const authenMiddleware = require("../middleware/authMiddleware");

function route(app) {
    app.use("/", authentication)
    app.use("/blog", blog)
    app.use("/admin", authenMiddleware, admin)
    app.use("/user", user)
}

module.exports = route;