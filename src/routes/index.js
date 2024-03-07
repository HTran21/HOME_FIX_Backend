const authentication = require("./authentication");
const user = require("./user")

function route(app) {
    app.use("/", authentication)
    app.use("/user", user)
}

module.exports = route;