const db = require('../app/models/index');
const { Op } = require('sequelize');

class CommentService {

    async getCommentByService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_Service = data.ID_Service
                let existService = await db.Service.findByPk(ID_Service)
                if (existService) {
                    let fiveStart = await db.Comment.count({ where: { rate: 5, ID_Service: ID_Service } })
                    let fourStart = await db.Comment.count({ where: { rate: 4, ID_Service: ID_Service } })
                    let threeStart = await db.Comment.count({ where: { rate: 3, ID_Service: ID_Service } })
                    let twoStart = await db.Comment.count({ where: { rate: 2, ID_Service: ID_Service } })
                    let oneStart = await db.Comment.count({ where: { rate: 1, ID_Service: ID_Service } })
                    let totalComments = await db.Comment.count({ where: { ID_Service: ID_Service } })

                    let pointEvaluate = (5 * fiveStart + 4 * fourStart + 3 * threeStart + 2 * twoStart + 1 * oneStart) / totalComments;


                    let listComment = await db.Comment.findAll({
                        where: {
                            ID_Service: existService.id
                        },
                        include: [{
                            model: db.User,
                            attributes: { exclude: ['password'] }

                        }]
                    })
                    resolve({ success: true, message: "Danh sách tin nhắn", listComment, evaluate: { fiveStart, fourStart, threeStart, twoStart, oneStart, pointEvaluate, totalComments } })

                }
                else {
                    resolve({ success: true, message: "Không tìm thấy dịch vụ" })
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async createCommentService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_User = data.ID_User;
                const ID_Service = data.id;
                const content = data.content;
                const rate = data.rate;

                let existService = await db.Service.findByPk(ID_Service)
                if (existService) {
                    let existUser = await db.User.findOne({
                        where: {
                            id: data.ID_User
                        }
                    });
                    if (existUser) {
                        let newComment = await db.Comment.create({
                            ID_Service: ID_Service,
                            ID_User: ID_User,
                            content: content,
                            rate: rate
                        })
                        resolve({ success: true, message: "Tạo bình luận thành công", newComment })
                    } else {
                        resolve({ success: false, message: "Không tìm thấy người dùng" })
                    }
                } else {
                    resolve({ success: false, message: "Không tìm thấy dịch vụ" })
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async updataCommentService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_Comment = data.id;
                const content = data.contentEdit;
                const rate = data.rateEdit;


                let existComment = await db.Comment.findByPk(ID_Comment)
                if (existComment) {
                    let updateComment = await db.Comment.update({
                        content: content,
                        rate: rate
                    }, {
                        where: {
                            id: ID_Comment
                        }
                    })
                    resolve({ success: true, message: "Chỉnh sửa bình luận thành công" })

                } else {
                    resolve({ success: false, message: "Không tìm thấy bình luận" })
                }
            }
            catch (error) {
                reject(error);
            }
        })

    }

    async deleteCommentService(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const ID_Comment = data.ID_Comment;
                let existComment = await db.Comment.findByPk(ID_Comment)
                if (existComment) {
                    let deleteComment = await db.Comment.destroy({
                        where: {
                            id: ID_Comment
                        }
                    })
                    resolve({ success: true, message: "Đã xóa bình luận" })

                } else {
                    resolve({ success: false, message: "Không tìm thấy bình luận" })
                }
            }
            catch (error) {
                reject(error);
            }
        })

    }

    async getCommentGoodService() {
        return new Promise(async (resolve, reject) => {
            try {
                let listComment = await db.Comment.findAll({
                    where: {
                        rate: {
                            [Op.between]: [3, 5]
                        }
                    },
                    include: [{
                        model: db.User,
                        attributes: { exclude: ['password'] }

                    }]
                })
                resolve(listComment)
            }
            catch (error) {
                reject(error);
            }
        })

    }


}

module.exports = new CommentService();