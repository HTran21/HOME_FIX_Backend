const db = require('../app/models/index');

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
                if (detailService) {
                    resolve({ success: true, message: "Chi tiết dịch vụ", detailService })
                } else {
                    resolve({ success: false, message: "Không tìm thấy dịch vụ" })
                }
            }
            catch (error) {
                console.log(error)
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

                const operationExists = await db.Operation.findAll({
                    include: [{
                        model: db.Categori,
                        where: {
                            ID_Service: id
                        },
                        raw: true
                    }]
                });

                if (!operationExists) {
                    let deleteDetailService = await db.Service.destroy({
                        where: {
                            id: id
                        }
                    })
                    resolve({ success: true, message: "Đã xóa dịch vụ" });
                }
                else {
                    resolve({ success: false, message: "Không thể xóa dịch vụ" });
                }

            }
            catch (error) {
                console.log("Loi", error)
                reject(error);
            }
        })
    }



    async createOperationService(nameOperation, priceOperation, idCategori) {
        return new Promise(async (resolve, reject) => {
            try {
                let operation = await db.Operation.findOne({ where: { nameOperation: nameOperation, ID_Categori: idCategori } })
                if (!operation) {
                    let newOperation = await db.Operation.create({
                        ID_Categori: idCategori,
                        nameOperation: nameOperation,
                        price: priceOperation,

                    });
                    resolve({ success: true, message: "Tạo thao tác thành công" });
                } else {
                    reject({ success: false, message: "Thao tác đã tồn tại" });
                }
            }
            catch (error) {
                reject(error)
            }
        })
    }

    async getDetailOperation(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let detailOperation = await db.Operation.findOne({ where: { id: id } })
                if (detailOperation) {
                    resolve({ detailOperation });
                } else {
                    reject({ success: false, message: "Thao tác không tồn tại" });
                }
            }
            catch {
                reject({ success: false, message: "Thao tác không tồn tại" });
            }
        })
    }


    async updateOperation(id, nameOperation, priceOperation) {
        return new Promise(async (resolve, reject) => {
            try {
                let updateOperation = await db.Operation.update({
                    nameOperation: nameOperation,
                    price: priceOperation,
                }, {
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Cập nhật thao tác thành công" });
            }
            catch (error) {
                reject(error);
            }

        })
    }

    async deleteOperation(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let deleteDetailOperation = await db.Operation.destroy({
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Đã xóa thao tác" });
            }
            catch (error) {
                reject(error);
            }
        })
    }

}

module.exports = new BlogService();
