const authentication = require("./authentication");
const user = require("./user");
const admin = require("./admin");
const service = require("./service");
const operation = require("./operation");
const product = require("./product");
const specialization = require("./specialization");
const repairer = require("./repairer");
const schedule = require("./schedule")
const authenMiddleware = require("../middleware/authMiddleware");

function route(app) {
    app.use("/", authentication)
    app.use("/service", service)
    app.use("/admin", authenMiddleware, admin)
    app.use("/user", user)
    app.use("/operation", operation)
    app.use("/product", product)
    app.use("/specialization", specialization)
    app.use("/repair", repairer)
    app.use("/schedule", schedule)
}

module.exports = route;