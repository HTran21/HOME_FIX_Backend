const db = require('../app/models/index');
const blogService = require("../services/blogService");

class BlogController {

    async getService(req, res, next) {
        try {
            let data = await blogService.getBlogService();
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
}

module.exports = new BlogController();