const authentication = require("./authentication");
const user = require("./user");
const admin = require("./admin");
const service = require("./service");
const operation = require("./operation");
const product = require("./product")
const authenMiddleware = require("../middleware/authMiddleware");

function route(app) {
    app.use("/", authentication)
    app.use("/service", service)
    app.use("/admin", authenMiddleware, admin)
    app.use("/user", user)
    app.use("/operation", user)
    app.use("/product", product)
}

module.exports = route;