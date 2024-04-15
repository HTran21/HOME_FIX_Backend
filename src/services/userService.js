const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');

class UserService {
    async updateProfileService(id, avatar, username, email, phone, address) {
        return new Promise(async (resolve, reject) => {
            try {

                let existUser = await db.User.findOne({ where: { id: id } });
                if (existUser) {
                    const emailChanged = existUser.email !== email;

                    let updateFields = {
                        username: username,
                        email: email,
                        phone: phone,
                        address: address
                    };

                    if (avatar) {
                        updateFields.avatar = avatar.originalname;
                    }
                    const updateProfile = await db.User.update(updateFields, { where: { id: id } });

                    const profileUser = await db.User.findOne({
                        where: { id: id },
                        attributes: ['id', 'role', 'username', 'email', 'phone', 'address', 'avatar']
                    });
                    const dataToken = {
                        role: profileUser.role,
                        id: profileUser.id,
                        username: profileUser.username,
                        email: profileUser.email,
                        phone: profileUser.phone,
                        address: profileUser.address,
                        avatar: profileUser.avatar
                    }
                    const access_token = jwt.sign(dataToken, 'access_token'
                        // , { expiresIn: '30m' }
                    )
                    resolve({ success: true, message: "Cập nhật thông tin thành công", emailChange: emailChanged, data: { access_token } });
                } else {
                    resolve({ success: false, message: "Người dùng không tồn tại" });
                }
            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

}

module.exports = new UserService();