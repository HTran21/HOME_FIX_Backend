// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const { Op } = require('sequelize');
const multer = require('multer');
const storage = require("../middleware/upload_image")
const productService = require("../services/productService");

class ProductController {

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