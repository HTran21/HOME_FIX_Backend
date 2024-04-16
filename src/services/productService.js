const db = require('../app/models/index');
const { Op, where } = require('sequelize');

class ProductService {

    async getProduct(ID_Categori, ID_Brand) {
        return new Promise(async (resolve, reject) => {
            // console.log("Categori", ID_Categori);
            // console.log("Brand", ID_Brand);
            const whereCondition = {};

            if (ID_Categori) {
                whereCondition.ID_Categori = ID_Categori
            }

            if (ID_Brand) {
                whereCondition.ID_Brand = ID_Brand
            }

            const listProduct = await db.Product.findAndCountAll({ where: whereCondition })

            resolve(listProduct);
        })
    }

    async getDetailProduct(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let product = await db.Product.findOne({ where: { id: id } });
                resolve(product);
            }
            catch (error) {
                reject(error)
            }
        })
    }

    async searchProduct(search) {
        return new Promise(async (resolve, reject) => {

            const listProduct = await db.Product.findAll({
                where: {
                    nameProduct: {
                        [Op.like]: `%${search}%`
                    }
                }
            })

            resolve(listProduct);
        })
    }

    async createProduct(idBrand, idCategori, nameProduct, imageProduct, contentMarkdown, contentHTML) {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log("idBrand", idBrand);
                // console.log("idCategori", idCategori);
                // console.log("nameProduct", nameProduct);
                // console.log("imageProduct", imageProduct);
                // console.log("contentMarkdown", contentMarkdown);
                // console.log("contentHTML", contentHTML);

                let product = await db.Product.findOne({ where: { nameProduct: nameProduct } })
                if (!product) {
                    let newProduct = await db.Product.create({
                        ID_Brand: idBrand,
                        ID_Categori: idCategori,
                        nameProduct: nameProduct,
                        imageProduct: imageProduct,
                        contentMarkdown: contentMarkdown,
                        contentHTML: contentHTML

                    })
                    resolve({ success: true, message: "Tạo sản phẩm thành công" });
                }
                else {
                    reject({ success: false, message: "Thương hiệu đã tồn tại" });
                }

            }
            catch (error) {
                reject(error)
            }
        })
    }


    async deleteProductService(ID_Product) {
        return new Promise(async (resolve, reject) => {
            try {
                let existProduct = await db.Product.findOne({
                    where: {
                        id: ID_Product
                    }
                })
                if (existProduct) {
                    let countProduct = await db.Order.count({
                        where: {
                            ID_Product: ID_Product
                        }
                    })
                    if (countProduct > 0) {
                        resolve({ success: false, message: "Không thể xóa sản phẩm" })
                    } else {
                        await db.Product.destroy({
                            where: {
                                id: ID_Product
                            }
                        })
                        resolve({ success: true, message: "Xóa sản phẩm thành công" })
                    }
                } else {
                    resolve({ success: false, message: "Không tìm thấy sản phẩm" })
                }
            }
            catch (error) {
                reject(error)
            }
        })
    }

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

    async updateBrandService(id, nameBrand, imageBrand) {
        return new Promise(async (resolve, reject) => {
            try {
                let existCategori = await db.Brand.findOne({ where: { id: id } });
                if (existCategori) {
                    let updateFields = {
                        nameBrand: nameBrand,
                    };

                    if (imageBrand) {
                        updateFields.imageBrand = imageBrand.originalname;
                    }
                    const updateBrand = await db.Brand.update(updateFields, { where: { id: id } });
                    resolve({ success: true, message: "Cập nhật thông tin thành công" });
                } else {
                    resolve({ success: false, message: "Loại thiết bị không tồn tại" });
                }
            }
            catch (error) {
                console.log(error)
                reject(error);
            }
        })
    }

    async deleteBrand(id) {
        return new Promise(async (resolve, reject) => {
            try {
                // Kiểm tra có sản phẩm
                let existBrand = await db.Brand.findOne({
                    where: {
                        id: id
                    }
                })
                if (existBrand) {
                    let countBrand = await db.Product.count({
                        where: {
                            ID_Brand: id
                        }
                    })
                    if (countBrand > 0) {
                        resolve({ success: false, message: "Không thể xóa thương hiệu" })
                    }
                    else {
                        let deleteBrand = await db.Brand.destroy({
                            where: {
                                id: id
                            }
                        })
                        resolve({ success: true, message: "Đã xóa thương hiệu" });
                    }

                }
                else {
                    resolve({ success: false, message: "Không tìm thấy thương hiệu" });
                }

            }
            catch (error) {
                reject(error);
            }
        })
    }

    async getCategories() {
        return new Promise(async (resolve, reject) => {
            try {
                let listCategories = await db.Categori.findAll({
                    include: [{
                        model: db.Service
                    }]
                });
                // console.log(listCategories)
                resolve(listCategories);
                // let categoriCounts = [];
                // for (let category of listCategories) {
                //     // Đếm số lượng sản phẩm từ bảng "Product" dựa trên "idCategory"
                //     let count = await db.Product.count({ where: { ID_Categori: category.id } });

                //     // Tạo đối tượng chứa idCategory và số lượng sản phẩm, sau đó đưa vào mảng kết quả
                //     categoriCounts.push({ category: category, count: count });
                // }
                // resolve(categoriCounts);
            }
            catch (error) {
                reject(error)
            }
        })
    }

    async getCategoriesService(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let listCategories = await db.Categori.findAll({ where: { ID_Service: id } });
                // // console.log(listCategories)
                resolve(listCategories);

            }
            catch (error) {
                reject(error)
            }
        })
    }

    async createCategories(idService, nameCategories, imageCategories) {
        return new Promise(async (resolve, reject) => {
            try {
                let category = await db.Categori.findOne({ where: { nameCategories: nameCategories } })
                if (!category) {
                    let newCategories = await db.Categori.create({
                        ID_Service: idService,
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
                let existCategori = await db.Categori.findOne({
                    where: {
                        id: id
                    }
                })
                if (existCategori) {
                    let countExist = await db.Operation.count({
                        where: { ID_Categori: id }
                    })
                    if (countExist > 0) {
                        resolve({ success: false, message: "Không thể xóa loại biết bị" })

                    }
                    else {
                        let deleteCategories = await db.Categori.destroy({
                            where: {
                                id: id
                            }
                        })
                        resolve({ success: true, message: "Xóa thành công loại thiết bị" });
                    }
                } else {
                    resolve({ success: false, message: "Không tìm thấy loại thiết bị" });
                }


            }
            catch (error) {
                reject(error);
            }
        })
    }
    async updateCategoriesService(id, idService, nameCategories, imageCategories) {
        return new Promise(async (resolve, reject) => {
            try {
                let existCategori = await db.Categori.findOne({ where: { id: id } });
                if (existCategori) {
                    let updateFields = {
                        nameCategories: nameCategories,
                        ID_Service: idService,
                    };

                    if (imageCategories) {
                        updateFields.imageCategories = imageCategories.originalname;
                    }
                    const updateProduct = await db.Categori.update(updateFields, { where: { id: id } });
                    resolve({ success: true, message: "Cập nhật thông tin thành công" });
                } else {
                    resolve({ success: false, message: "Loại thiết bị không tồn tại" });
                }
            }
            catch (error) {
                console.log(error)
                reject(error);
            }
        })
    }


}

module.exports = new ProductService();