const express = require("express");
const router = express.Router();
const commentController = require("../controller/CommentController")
const loginMiddleware = require("../middleware/loginMiddleware")

router.get("/", commentController.getCommentByService);
router.get("/commentGood", commentController.getCommentGood);
router.post("/", loginMiddleware, commentController.postComment);
router.put("/", loginMiddleware, commentController.updateComment);
router.delete("/", loginMiddleware, commentController.deleteComment);

module.exports = router;