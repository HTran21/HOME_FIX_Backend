const db = require('../app/models/index');

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
}

module.exports = new AdminService();