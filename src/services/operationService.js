const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const { where } = require("sequelize");

class OperationService {
    async operationByCategori(ID_Categori) {
        return new Promise(async (resolve, reject) => {
            try {
                let existCategori = await db.Categori.findByPk(ID_Categori)
                if (existCategori) {
                    let listOperationByCategori = await db.Operation.findAll({
                        where: {
                            ID_Categori: ID_Categori
                        }
                    })
                    resolve({ success: true, message: "Danh sách  thao tác theo loại thiết bị", listOperationByCategori });
                } else {
                    resolve({ success: false, message: "Không tìm thấy loại thiết bị" });
                }
            }
            catch (error) {
                console.log("Error", error)
                reject(error);
            }
        })
    }

}

module.exports = new OperationService();