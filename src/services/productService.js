const db = require('../app/models/index');

class ProductService {

    async getBrand() {
        return new Promise(async (resolve, reject) => {
            try {
                let listBrand = await db.Brand.findAll();
                resolve(listBrand);
            }
            catch (error) {
                reject(error)
            }
        })
    }


    async createBrand(nameBrand, imageBrand) {
        return new Promise(async (resolve, reject) => {
            try {
                let operation = await db.Brand.findOne({ where: { nameBrand: nameBrand } })
                if (!operation) {
                    let newBrand = await db.Brand.create({
                        nameBrand: nameBrand,
                        imageBrand: imageBrand,
                    });
                    resolve({ success: true, message: "Tạo thương hiệu thành công" });
                } else {
                    reject({ success: false, message: "Thương hiệu đã tồn tại" });
                }
            }
            catch (error) {
                reject(error)
            }
        })
    }

    async deleteBrand(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let deleteBrand = await db.Brand.destroy({
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Đã xóa thương hiệu" });
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async getCategories() {
        return new Promise(async (resolve, reject) => {
            try {
                let listCategories = await db.Categori.findAll();
                // console.log(listCategories)
                resolve(listCategories);
            }
            catch (error) {
                reject(error)
            }
        })
    }

    async createCategories(nameCategories, imageCategories) {
        return new Promise(async (resolve, reject) => {
            try {
                let category = await db.Categori.findOne({ where: { nameCategories: nameCategories } })
                if (!category) {
                    let newCategories = await db.Categori.create({
                        nameCategories: nameCategories,
                        imageCategories: imageCategories
                    })
                    resolve({ success: true, message: "Tạo loại thiết bị thành công" });
                }
                else {
                    reject({ success: false, message: "Loại thiết bị đã tồn tại" });
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async deleteCategories(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let deleteCategories = await db.Categori.destroy({
                    where: {
                        id: id
                    }
                })
                resolve({ success: true, message: "Đã xóa thương hiệu" });
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new ProductService();