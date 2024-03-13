// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const blogService = require("../services/blogService");
const multer = require('multer');
const storage = require("../middleware/upload_image")

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

    async getDetailService(req, res, next) {
        try {
            const id = req.params.id;
            let data = await blogService.getDetailBlogService(id);
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

    async updateService(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single('logoService');

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                } else {
                    if (req.file) {
                        const url = req.file.originalname;
                        const id = req.params.id;
                        const { nameService, contentHTML, contentMarkdown } = req.body;
                        try {
                            let data = await blogService.updateServiceImage(id, nameService, contentHTML, contentMarkdown, url)
                            return res.json(data);
                        }
                        catch (error) {
                            return res.json(error);
                        }
                    }
                    else {
                        const id = req.params.id;
                        const { nameService, contentHTML, contentMarkdown } = req.body;
                        try {
                            let data = await blogService.updateService(id, nameService, contentHTML, contentMarkdown)
                            return res.json(data);
                        }
                        catch (error) {
                            return res.json(error);
                        }
                    }
                }
            })
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }


            // return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteBlogService(req, res, next) {
        try {
            const id = req.params.id;
            let data = await blogService.deleteBlogService(id);
            return res.json(data);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }
}

module.exports = new BlogController();