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
}

module.exports = new ProductService();