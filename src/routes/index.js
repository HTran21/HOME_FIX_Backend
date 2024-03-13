const authentication = require("./authentication");
const user = require("./user");
const admin = require("./admin");
const service = require("./service")
const authenMiddleware = require("../middleware/authMiddleware");

function route(app) {
    app.use("/", authentication)
    app.use("/service", service)
    app.use("/admin", authenMiddleware, admin)
    app.use("/user", user)
}

module.exports = route;