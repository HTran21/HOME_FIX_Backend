// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const messageService = require("../services/messageService");

class MessageController {

    async createRoomChat(req, res, next) {
        try {

        }
        catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    async createMessage(req, res, next) {
        try {
            const { room, senderId, senderType, text } = req.body;
            try {
                const data = await messageService.createMessageService(room, senderId, senderType, text);
                return res.json(data);
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Có lỗi xảy ra khi gửi tin nhắn" });
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    }

    async listRoomOfUser(req, res, next) {
        try {
            const userOne = req.query.userOne;
            let data = await messageService.getListRoomOfUser(userOne)
            return res.json(data)
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    async listRoomOfAdmin(req, res, next) {
        try {
            let data = await messageService.listRoomOfAdminService();
            return res.json(data)
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }

    async listMessage(req, res, next) {
        try {
            const ID_Room = req.query.ID_Room;
            let data = await messageService.getListMessage(ID_Room)
            return res.json(data)
        }
        catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    }
}

module.exports = new MessageController();