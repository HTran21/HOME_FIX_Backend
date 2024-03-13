const db = require('../app/models/index');
const { deleteService } = require('../controller/ServiceController');

class BlogService {
    async getBlogService() {
        return new Promise(async (resolve, reject) => {
            try {
                let listService = await db.Service.findAll();
                resolve({ listService });
            }
            catch (error) {
                reject(error);
            }
        })

    }

    async getDetailBlogService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let detailService = await db.Service.findOne({ where: { id: id } });
                resolve({ detailService });
            }
            catch (error) {
                reject(error);
            }
        })

    }

    async updateServiceImage(id, nameService, contentHTML, contentMarkdown, url) {
        return new Promise(async (resolve, reject) => {
            try {
                let updateService = await db.Service.update({
                    nameService: nameService,
                    contentHTML: contentHTML,
                    contentMarkDown: contentMarkdown,
                    logoService: url
                }, {
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Cập nhật dịch vụ thành công" });
            }
            catch (error) {
                reject(error);
            }

        })
    }

    async updateService(id, nameService, contentHTML, contentMarkdown) {
        return new Promise(async (resolve, reject) => {
            try {
                let updateDetailService = await db.Service.update({
                    nameService: nameService,
                    contentHTML: contentHTML,
                    contentMarkDown: contentMarkdown,
                }, {
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Cập nhật dịch vụ thành công" });
            }
            catch (error) {
                reject(error);
            }

        })
    }

    async deleteBlogService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let deleteDetailService = await db.Service.destroy({
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Đã xóa dịch vụ" });
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new BlogService();
