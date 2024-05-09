const db = require('../app/models/index');
const multer = require('multer');
const storage = require("../middleware/upload_image");
const statisticalService = require("../services/statisticalService");

class StatisticalController {


    async overviewStatistical(req, res, next) {
        try {
            let data = await statisticalService.overviewStatisticalService();
            return res.json(data)

        }
        catch (error) {
            console.log(error)
            return res.json(error);
        }
    }

    async earningStatistical(req, res, next) {
        try {
            const data = await statisticalService.earningStatisticalService(req.query);
            return res.json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }

    async earningStatisticalSelect(req, res, next) {
        try {
            // console.log(req.query)
            const data = await statisticalService.earningStatisticalSelectService(req.query)
            return res.json(data)
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }
    async earningByCategori(req, res, next) {
        try {
            // console.log(req.query)
            const data = await statisticalService.earningByCategoriService(req.query)
            return res.json(data)
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }

    async orderStatistical(req, res, next) {
        try {
            // console.log(req.query)
            const data = await statisticalService.orderStatisticalService(req.query)
            return res.json(data)
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }

    async orderStatisticalByCategori(req, res, next) {
        try {
            // console.log(req.query)
            const data = await statisticalService.orderStatisticalByCategoriService(req.query)
            return res.json(data)
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }

    async repairerStatistic(req, res, next) {
        try {
            const data = await statisticalService.repairerStatisticService(req.query)
            return res.json(data)

        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }

    async overviewJob(req, res, next) {
        try {
            const data = await statisticalService.overviewJobService(req.query)
            return res.json(data)
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }

    async jobStatistical(req, res, next) {
        try {
            const data = await statisticalService.jobStatisticalService(req.query)
            return res.json(data)
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
        }
    }

}

module.exports = new StatisticalController();