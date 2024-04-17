const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');

class RepairerService {
    async createStaffService(username, password, position, email, phone, address, specialization, role, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.Staff.findOne({ where: { emailStaff: emailStaff } });
                if (!user) {
                    const hashedPassword = await bcrypt.hash(passwordStaff, 10);

                    // let newUser = await db.Staff.create({
                    //     usernameStaff: usernameStaff,
                    //     passwordStaff: hashedPassword,
                    //     position: position,
                    //     emailStaff: emailStaff,
                    //     phoneStaff: phoneStaff,
                    //     addressStaff: addressStaff,
                    //     role: role,
                    //     status: status
                    // });

                    // console.log("New User", newUser);
                    resolve({ success: true, message: "Create successful", data: { newUser } });
                } else {
                    reject({ success: false, message: "User already exists" });
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async detailProfile(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.Repairer.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.Service,
                            attributes: ['nameService']
                        }
                    ],
                    attributes: { exclude: ['passwordRepairer'] }
                });
                if (user) {
                    resolve({ success: true, message: "Tìm thấy tài khoản", data: { user } });
                }

                else {
                    reject({ success: false, message: "Không tìm thấy tài khoản" });
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async updateProfileService(id, avatar, username, email, phone, address) {
        return new Promise(async (resolve, reject) => {
            try {

                let existRepairer = await db.Repairer.findOne({ where: { id: id } });
                if (existRepairer) {
                    const emailChanged = existRepairer.emailRepairer !== email;

                    let updateFields = {
                        usernameRepairer: username,
                        emailRepairer: email,
                        phoneRepairer: phone,
                        addressRepairer: address
                    };

                    if (avatar) {
                        updateFields.avatarRepairer = avatar.originalname;
                    }
                    const updateProfile = await db.Repairer.update(updateFields, { where: { id: id } });

                    const profileRepaier = await db.Repairer.findOne({
                        where: { id: id },
                        attributes: ['id', 'role', 'usernameRepairer', 'emailRepairer', 'phoneRepairer', 'addressRepairer', 'avatarRepairer']
                    });
                    const dataToken = {
                        role: profileRepaier.role,
                        id: profileRepaier.id,
                        username: profileRepaier.usernameRepairer,
                        email: profileRepaier.emailRepairer,
                        phone: profileRepaier.phoneRepairer,
                        address: profileRepaier.addressRepairer,
                        avatar: profileRepaier.avatarRepairer
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

module.exports = new RepairerService();