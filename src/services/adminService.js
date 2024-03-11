const db = require('../app/models/index');

class AdminService {
    async postService(nameService, contentHTML, contentMarkdown, url) {
        return new Promise(async (resolve, reject) => {
            try {
                let blog = await db.Blog.findOne({ where: { nameService: nameService } })
                if (!blog) {
                    let newBlog = await db.Blog.create({
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