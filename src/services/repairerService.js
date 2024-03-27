const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');

class RepairerService {
    async createStaffService(username, password, position, email, phone, address, specialization, role, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.Staff.findOne({ where: { emailStaff: emailStaff } });
                if (!user) {
                    const hashedPassword = await bcrypt.hash(passwordStaff, 10);

                    // let newUser = await db.Staff.create({
                    //     usernameStaff: usernameStaff,
                    //     passwordStaff: hashedPassword,
                    //     position: position,
                    //     emailStaff: emailStaff,
                    //     phoneStaff: phoneStaff,
                    //     addressStaff: addressStaff,
                    //     role: role,
                    //     status: status
                    // });

                    // console.log("New User", newUser);
                    resolve({ success: true, message: "Create successful", data: { newUser } });
                } else {
                    reject({ success: false, message: "User already exists" });
                }
            }
            catch (error) {
                reject(error);
            }
        })
    }

    async updateREpairer(username, password, position, email, avatar, phone, address, specialize) {
        return new Promise(async (resolve, reject) => {
            try {

                // if (!user) {
                //     const hashedPassword = await bcrypt.hash(passwordStaff, 10);

                //     // let newUser = await db.Staff.create({
                //     //     usernameStaff: usernameStaff,
                //     //     passwordStaff: hashedPassword,
                //     //     position: position,
                //     //     emailStaff: emailStaff,
                //     //     phoneStaff: phoneStaff,
                //     //     addressStaff: addressStaff,
                //     //     role: role,
                //     //     status: status
                //     // });

                //     // console.log("New User", newUser);
                //     resolve({ success: true, message: "Create successful", data: { newUser } });
                // } else {
                //     reject({ success: false, message: "User already exists" });
                // }
            }
            catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new RepairerService();