const db = require('../app/models/index')
const multer = require('multer');
const storage = require("../middleware/upload_image");
const adminService = require('../services/adminService');

class AdminController {

    async addService(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single('logoService');

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                } else {
                    const url = req.file.originalname;
                    const { nameService, contentHTML, contentMarkdown } = req.body;
                    try {
                        let data = await adminService.postService(nameService, contentHTML, contentMarkdown, url)
                        return res.json(data);
                    }
                    catch (error) {
                        return res.json(error);
                    }

                }
            })
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

module.exports = new AdminController();