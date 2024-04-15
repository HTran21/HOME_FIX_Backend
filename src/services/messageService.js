const { where } = require('sequelize');
const db = require('../app/models/index');
const bcrypt = require('bcrypt');

class MessageService {
    async createRoom(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_User = id;

                let room = await db.RoomMessage.findOne({
                    where: {
                        userOne: ID_User,
                    }
                })

                if (room) {
                    resolve({ success: false, message: "Phòng chat đã được tạo", data: room })
                }
                else {
                    const adminChat = await db.Staff.findOne({
                        where: {
                            emailStaff: "minhtung@gmail.com"
                        }
                    })

                    if (!adminChat) {
                        resolve({ success: false, message: "Admin chat không tồn tại" })
                    }

                    console.log("ID_User", ID_User)
                    console.log("ID_Admin", adminChat.id)

                    let createRoom = await db.RoomMessage.create({
                        userOne: ID_User,
                        userTwo: adminChat.id,
                    })
                    resolve({ success: true, message: "Tạo phòng chat thành công", data: createRoom })
                }


            }
            catch (error) {
                reject(error);
            }
        })
    }

    async createMessageService(room, senderId, senderType, text) {
        return new Promise(async (resolve, reject) => {
            try {
                const existRoom = await db.RoomMessage.findByPk(room)
                if (!existRoom) {
                    resolve({ success: false, message: "Phòng chat không tồn tại" })
                } else {

                    const data = await db.Message.create({
                        ID_Room: room,
                        senderID: senderId,
                        senderType: senderType,
                        text: text,
                        unRead: 'UR'
                    })

                    resolve({ success: true, message: "Gửi tin nhắn thành công", data })
                }


            }
            catch (error) {
                reject(error);
            }
        })
    }

    async getListRoomOfUser(userOne) {
        return new Promise(async (resolve, reject) => {
            try {
                let room = await db.RoomMessage.findAll({
                    where: {
                        userOne: userOne,

                    }
                })

                resolve({ success: true, message: "Danh sách phòng chat", room })


                // if (room) {
                //     for (let i = 0; i < room.length; i++) {
                //         room[i].messageData = await db.Message.findAll({
                //             where: { ID_Room: room[i].id },
                //         });



                //         // room[i].userOneData = await db.User.findOne({
                //         //     where: {
                //         //         id: room[i].userOne
                //         //     }
                //         // })
                //     }
                //     resolve({ success: true, message: "Tin nhắn phòng chat", room })
                // } else {
                //     resolve({ success: false, message: "Không tìm thấy phòng chat" })
                // }
            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

    async listRoomOfAdminService() {
        return new Promise(async (resolve, reject) => {
            try {
                let admin = await db.Staff.findOne({
                    where: {
                        emailStaff: "minhtung@gmail.com"
                    }
                })

                if (!admin) {
                    resolve({ success: false, message: "Không tìm thấy người dùng" })
                }
                else {
                    let room = await db.RoomMessage.findAll({
                        where: {
                            userTwo: admin?.id,

                        },
                        include: [{
                            model: db.User,
                            attributes: { exclude: ['password'] }
                        }]
                    })
                    resolve({ success: true, message: "Danh sách phòng chat Admin", room })
                }


            }
            catch (error) {
                reject(error);
            }
        })
    }

    async getListMessage(ID_Room) {
        return new Promise(async (resolve, reject) => {
            try {
                let listMessage = await db.Message.findAll({
                    where: {
                        ID_Room: ID_Room
                    }
                })
                resolve({ success: true, message: `Danh sách tin nhắn phòng chat ID ${ID_Room}`, listMessage })
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new MessageService();