// const { da } = require('date-fns/locale');
const db = require('../app/models/index');
const serviceService = require("../services/serviceService");
const multer = require('multer');
const storage = require("../middleware/upload_image")

class ServiceController {

    async getService(req, res, next) {
        try {
            let data = await serviceService.getBlogService();
            return res.json(data);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }


            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getDetailService(req, res, next) {
        try {
            const id = req.params.id;
            let data = await serviceService.getDetailBlogService(id);
            return res.json(data);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }


            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async updateService(req, res, next) {
        try {
            const upload = multer({ storage: storage }).single('logoService');

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    res.send(err);
                }
                else if (err) {
                    res.send(err);
                } else {
                    if (req.file) {
                        const url = req.file.originalname;
                        const id = req.params.id;
                        const { nameService, contentHTML, contentMarkdown } = req.body;
                        try {
                            let data = await serviceService.updateServiceImage(id, nameService, contentHTML, contentMarkdown, url)
                            return res.json(data);
                        }
                        catch (error) {
                            return res.json(error);
                        }
                    }
                    else {
                        const id = req.params.id;
                        const { nameService, contentHTML, contentMarkdown } = req.body;
                        try {
                            let data = await serviceService.updateService(id, nameService, contentHTML, contentMarkdown)
                            return res.json(data);
                        }
                        catch (error) {
                            return res.json(error);
                        }
                    }
                }
            })
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }


            // return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async deleteBlogService(req, res, next) {
        try {
            const id = req.params.id;
            let data = await serviceService.deleteBlogService(id);
            return res.json(data);
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }
        }
    }

    async createOperation(req, res, next) {
        try {
            const nameOperation = req.body.nameOperation;
            const priceOperation = parseInt(req.body.priceOperation);
            const idService = parseInt(req.body.idService);
            const idCategori = parseInt(req.body.idCategori);
            try {
                let data = await serviceService.createOperationService(nameOperation, priceOperation, idService, idCategori)
                return res.json(data);
            }
            catch (error) {
                return res.json(error)
            }
        }
        catch (e) {
            console.error(e);
            if (e) {
                return res.status(400).json({ error: e });
            }

        }
    }

    async getDetailOperation(req, res, next) {
        try {
            const id = req.params.id;
            let data = await serviceService.getDetailOperation(id);
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            return res.json({ error: e })
        }
    }

    async getAllServicesWithOperations(req, res, next) {
        try {
            // Truy vấn toàn bộ dữ liệu từ bảng Service
            const services = await db.Service.findAll();

            // Duyệt qua mỗi Service và lấy danh sách các Operation tương ứng
            const servicesWithOperations = await Promise.all(services.map(async (service) => {
                const operations = await db.Operation.findAll({ where: { ID_Service: service.id } });
                return { service, operations };
            }));

            // Trả về mảng chứa thông tin về tất cả các Service và các Operation tương ứng
            return res.json(servicesWithOperations);
        } catch (error) {
            console.error('Error retrieving services with operations:', error);
            throw error;
        }
    };

    async updateOperation(req, res, next) {
        try {
            const { nameOperation, priceOperation } = req.body;
            const id = req.params.id;
            let data = await serviceService.updateOperation(id, nameOperation, priceOperation);
            return res.json(data);
        }
        catch (error) {
            console.log(error);
            return res.json({ error })
        }
    }

    async deleteOperation(req, res, next) {
        try {
            const id = req.params.id;
            let data = await serviceService.deleteOperation(id);
            return res.json(data);
        }
        catch (e) {
            console.log(e);
            return res.json({ error });
        }
    }

}

module.exports = new ServiceController();