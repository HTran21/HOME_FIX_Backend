const express = require("express");
const router = express.Router();
const messageController = require("../controller/MessageController")

router.post("/createRoom", messageController.createRoomChat);
router.post("/create", messageController.createMessage);
router.get("/listRoomOfUser", messageController.listRoomOfUser);
router.get("/listRoomOfAdmin", messageController.listRoomOfAdmin);
router.get("/listMessage", messageController.listMessage);

module.exports = router;