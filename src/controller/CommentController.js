const db = require('../app/models/index');
const multer = require('multer');
const storage = require("../middleware/upload_image");
const commentService = require("../services/commentService");

class CommentController {

    async getCommentByService(req, res, next) {
        try {
            let data = await commentService.getCommentByService(req.query)
            return res.json(data)

        }
        catch (error) {
            console.log(error)
            return res.json(error);
        }
    }

    async postComment(req, res, next) {
        try {
            let data = await commentService.createCommentService(req.body)
            return res.json(data)

        }
        catch (error) {
            console.log(error)
            return res.json(error);
        }
    }

    async updateComment(req, res, next) {
        try {
            let data = await commentService.updataCommentService(req.body);
            return res.json(data)
        }
        catch (error) {
            console.log(error)
            return res.json(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            let data = await commentService.deleteCommentService(req.query)
            return res.json(data)
        }
        catch (error) {
            console.log(error)
            return res.json(error);
        }
    }

    async getCommentGood(req, res, next) {
        try {
            let data = await commentService.getCommentGoodService()
            return res.json(data)
        }
        catch (error) {
            console.log(error)
            return res.json(error);
        }
    }

}

module.exports = new CommentController();