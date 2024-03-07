const db = require('../app/models/index')

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
}

module.exports = new UserController();