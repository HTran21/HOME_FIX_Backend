const authentication = require("./authentication");
const user = require("./user");
const admin = require("./admin");
const service = require("./service");
const operation = require("./operation");
const product = require("./product");
const specialization = require("./specialization");
const repairer = require("./repairer");
const schedule = require("./schedule");
const order = require("./order");
const payment = require("./payment");
const message = require("./message");
const statistical = require("./statistical");
const comment = require("./comment");
const notification = require("./notification");
const feedback = require("./feedback")
const authenMiddleware = require("../middleware/authMiddleware");
const loginMiddleware = require("../middleware/loginMiddleware");

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
    app.use("/order", loginMiddleware, order)
    app.use("/payment", payment)
    app.use("/message", loginMiddleware, message)
    app.use("/statistical", statistical)
    app.use("/comment", comment)
    app.use("/notification", loginMiddleware, notification)
    app.use("/feedback", loginMiddleware, feedback)
}

module.exports = route;