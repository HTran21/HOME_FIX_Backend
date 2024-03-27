const db = require('../app/models/index');
const bcrypt = require('bcrypt');

class AdminService {
    async postService(nameService, contentHTML, contentMarkdown, url) {
        return new Promise(async (resolve, reject) => {
            try {
                let service = await db.Service.findOne({ where: { nameService: nameService } })
                if (!service) {
                    let newService = await db.Service.create({
                        nameService: nameService,
                        contentHTML: contentHTML,
                        contentMarkDown: contentMarkdown,
                        logoService: url
                    });
                    resolve({ success: true, message: "Tạo dịch vụ thành công" });
                } else {
                    reject({ success: false, message: "Dịch vụ đã tồn tại" });
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async createStaffService(username, password, position, email, avatar, phone, address, specialize, role, status) {
        return new Promise(async (resolve, reject) => {
            try {

                let repairer = await db.Repairer.findOne({ where: { emailRepairer: email } });
                if (!repairer) {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    let newRepairer = await db.Repairer.create({
                        ID_Speliciazation: specialize,
                        usernameRepairer: username,
                        passwordRepairer: hashedPassword,
                        position: position,
                        emailRepairer: email,
                        phoneRepairer: phone,
                        addressRepairer: address,
                        avatarRepairer: avatar,
                        role: role,
                        status: status
                    });

                    resolve({ success: true, message: "Tạo tài khoản thành công", data: { newRepairer } });
                } else {
                    reject({ success: false, message: "Tài khoản đã tồn tại" });
                }
            }
            catch (error) {
                console.log("Lỗi", error)
                reject(error);
            }
        })
    }
}

module.exports = new AdminService();