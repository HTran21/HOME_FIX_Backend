// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const { Op } = require('sequelize');
const multer = require('multer');
const storage = require("../middleware/upload_image")
const productService = require("../services/productService");

class ProductController {

    async getProduct(req, res, next) {
        try {
            // console.log("Fillter", req.query)
            if (req.query.categori || req.query.brand) {
                const categori = req.query.categori;
                const brand = req.query.brand;

                const data = await productService.getProduct(categori, brand);
                return res.json(data);
            }
            if (req.query.search) {
                const search = req.query.search;
                const data = await productService.searchProduct(search);
                return res.json(data)
            }
            else {
                const data = await db.Product.findAll();
                return res.json(data)
            }

            // const data = await db.Product.findAll();
            // return res.json(data)
            // const search = req.query.search;
            // if (search) {
            //     const products = await db.Brand.findAll({
            //         where: {
            //             nameBrand: {
            //                 [Op.like]: `%${search}%`
            //             }
            //         }
            //     })
            //     return res.json(products)
            // }
            // else {
            //     const data = await db.Product.findAll();
            //     return res.json(data)
            // }

        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e })
        }
    }

    async getDetailProduct(req, res, next) {
        try {
            const id = req.params.id;
            try {
                let data = await productService.getDetailProduct(id);
                return res.json(data);
            }
            catch (error) {
                console.log("Loi", error)
                return res.json(error)
            }
        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e })
        }
    }

    async updateProduct(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single("imageProduct");
            const id = req.params.id;
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                }
                else {
                    if (req.file) {
                        const imageProduct = req.file.originalname
                        const { nameProduct, idBrand, idCategori, contentMarkdown, contentHTML } = req.body;
                        let updateProduct = await db.Product.update({
                            ID_Brand: idBrand,
                            ID_Categori: idCategori,
                            nameProduct: nameProduct,
                            imageProduct: imageProduct,
                            contentMarkdown: contentMarkdown,
                            contentHTML: contentHTML
                        }, {
                            where: {
                                id
                            }
                        })
                        return res.json({ success: true, message: "Cập nhật sản phẩm thành công" });

                    }
                    else {
                        const { nameProduct, idBrand, idCategori, contentMarkdown, contentHTML } = req.body;
                        let updateProduct = await db.Product.update({
                            ID_Brand: idBrand,
                            ID_Categori: idCategori,
                            nameProduct: nameProduct,
                            contentMarkdown: contentMarkdown,
                            contentHTML: contentHTML
                        }, {
                            where: {
                                id
                            }
                        })
                        return res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
                    }

                }
            })

        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e })
        }
    }


    async createProduct(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single("imageProduct");

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                }
                else {
                    const { nameProduct, idBrand, idCategori, contentMarkdown, contentHTML } = req.body;
                    // const idBrand = parseInt(req.body.idBrand);
                    // const idCategori = parseInt(req.body.idCategori);
                    const imageProduct = req.file.originalname
                    try {
                        let data = await productService.createProduct(idBrand, idCategori, nameProduct, imageProduct, contentMarkdown, contentHTML);
                        return res.json(data);
                    }
                    catch (error) {
                        console.log("Loi", error)
                        return res.json(error)
                    }

                }
            })
        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e });
        }
    }

    async getBrand(req, res, next) {
        try {
            const search = req.query.search;
            if (search) {
                const products = await db.Brand.findAll({
                    where: {
                        nameBrand: {
                            [Op.like]: `%${search}%`
                        }
                    }
                })
                return res.json(products)
            }
            else {
                let data = await productService.getBrand();
                return res.json(data);
            }

        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e })
        }
    }

    async createBrand(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single("imageBrand");

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                }
                else {
                    const nameBrand = req.body.nameBrand;
                    const imageBrand = req.file.originalname;
                    try {
                        let data = await productService.createBrand(nameBrand, imageBrand);
                        return res.json(data);
                    }
                    catch (error) {
                        return res.json(error);
                    }


                }
            })
        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e });
        }
    }

    async deleteBrand(req, res, next) {
        try {

            const id = req.params.id;
            let data = await productService.deleteBrand(id);
            return res.json(data);

        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e })
        }
    }

    async getCategories(req, res, next) {
        try {

            let data = await productService.getCategories();
            return res.json(data);

        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e })
        }
    }

    async createCategories(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single("imageCategories");

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                }
                else {
                    const nameCategories = req.body.nameCategories;
                    const imageCategories = req.file.originalname;
                    try {
                        let data = await productService.createCategories(nameCategories, imageCategories);
                        return res.json(data);
                    }
                    catch (error) {
                        return res.json(error)
                    }

                }
            })
        }
        catch (e) {
            console.log(e)
            return res.status(400).json({ error: e })
        }
    }

    async deleteCategories(req, res, next) {
        try {

            const id = req.params.id;
            let data = await productService.deleteCategories(id);
            return res.json(data);

        }
        catch (e) {
            console.log(e);
            return res.status(400).json({ error: e })
        }
    }

}

module.exports = new ProductController();