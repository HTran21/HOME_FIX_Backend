const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

class AuthenticationService {
    async registerServiceStaff(usernameStaff, passwordStaff, position, emailStaff, phoneStaff, addressStaff, role, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.Staff.findOne({ where: { emailStaff: emailStaff } });
                if (!user) {
                    const hashedPassword = await bcrypt.hash(passwordStaff, 10);

                    let newUser = await db.Staff.create({
                        usernameStaff: usernameStaff,
                        passwordStaff: hashedPassword,
                        position: position,
                        emailStaff: emailStaff,
                        phoneStaff: phoneStaff,
                        addressStaff: addressStaff,
                        role: role,
                        status: status
                    });

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

    async registerService(username, password, email, phone, address, avatar, role, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({ where: { email: email } });
                if (!user) {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    let newUser = await db.User.create({
                        username: username,
                        password: hashedPassword,
                        email: email,
                        phone: phone,
                        address: address,
                        avatar: avatar,
                        role: role,
                        status: status
                    });

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

    async loginServiceStaff(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.Staff.findOne({ where: { emailStaff: email } });

                if (!user) {

                    reject({ success: false, message: "User not found" });
                }

                const isPasswordValid = await bcrypt.compare(password, user.passwordStaff);
                if (!isPasswordValid) {
                    reject({ success: false, message: "Invalid password" });
                }
                else {
                    const access_token = jwt.sign({
                        role: user.role,
                        id: user.id,
                        username: user.usernameStaff,
                        position: user.position,
                        email: user.emailStaff,
                        phone: user.phoneStaff,
                        address: user.addressStaff,
                        avatar: user.avatarStaff
                    }, 'access_token', { expiresIn: '30m' })
                    // console.log("access token user", access_token)
                    resolve({ success: true, message: "Login successful", data: { access_token } });
                }
            } catch (error) {
                reject(error);
            }
        })
    }
    async loginService(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: {
                        email: email,
                        status: {
                            [Op.ne]: 'D'
                        }
                    }
                });
                let staff = await db.Staff.findOne({
                    where: {
                        emailStaff: email,
                        status: {
                            [Op.ne]: 'D'
                        }
                    }
                });
                let repairer = await db.Repairer.findOne({
                    where: {
                        emailRepairer: email,
                        status: {
                            [Op.ne]: 'D'
                        }
                    }
                });

                // if (!user) {

                //     reject({ success: false, message: "User not found" });
                // }

                if (user) {
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    const role = user.role;
                    if (!isPasswordValid) {
                        reject({ success: false, message: "Sai mật khẩu" });
                    }
                    else {
                        const infoUser = {
                            role: user.role,
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            phone: user.phone,
                            address: user.address,
                            avatar: user.avatar
                        }
                        const access_token = jwt.sign(infoUser, 'access_token'
                            // , { expiresIn: '30m' }
                        )
                        // console.log("access token user", access_token)
                        resolve({ success: true, message: "Đăng nhập thành công", data: { access_token, infoUser, role } });
                    }
                }
                else if (staff) {
                    const isPasswordValid = await bcrypt.compare(password, staff.passwordStaff);
                    const role = staff.role;

                    if (!isPasswordValid) {
                        reject({ success: false, message: "Sai mật khẩu" });
                    }
                    else {
                        const infoStaff = {
                            role: staff.role,
                            id: staff.id,
                            username: staff.usernameStaff,
                            position: staff.position,
                            email: staff.emailStaff,
                            position: staff.position,
                            phone: staff.phoneStaff,
                            address: staff.addressStaff,
                            avatar: staff.avatarStaff
                        }
                        const access_token = jwt.sign(infoStaff, 'access_token'
                            // , { expiresIn: '30m' }
                        )
                        // console.log("access token user", access_token)
                        resolve({ success: true, message: "Đăng nhập thành công", data: { access_token, infoStaff, role } });
                    }
                }

                else if (repairer) {
                    const isPasswordValid = await bcrypt.compare(password, repairer.passwordRepairer);
                    const role = repairer.role;

                    if (!isPasswordValid) {
                        reject({ success: false, message: "Sai mật khẩu" });
                    }
                    else {
                        const infoRepairer = {
                            role: repairer.role,
                            id: repairer.id,
                            username: repairer.usernameRepairer,
                            position: repairer.position,
                            email: repairer.emailRepairer,
                            phone: repairer.phoneRepaierer,
                            position: repairer.position,
                            address: repairer.addressRepaierer,
                            avatar: repairer.avatarRepairer
                        }
                        const access_token = jwt.sign(infoRepairer, 'access_token'
                            // , { expiresIn: '30m' }
                        )
                        // console.log("access token user", access_token)
                        resolve({ success: true, message: "Đăng nhập thành công", data: { access_token, infoRepairer, role } });
                    }
                }

                else {

                    reject({ success: false, message: "Tài khoản không tồn tại" });

                }


            } catch (error) {
                console.log(error)
                reject(error);
            }
        })
    }
}

module.exports = new AuthenticationService();