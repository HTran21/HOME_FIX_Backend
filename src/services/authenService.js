const jwt = require("jsonwebtoken");
const db = require('../app/models/index');
const bcrypt = require('bcrypt');

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

                    console.log("New User", newUser);
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

                    console.log("New User", newUser);
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
                let user = await db.User.findOne({ where: { email: email } });

                if (!user) {

                    reject({ success: false, message: "User not found" });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    reject({ success: false, message: "Invalid password" });
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
                    resolve({ success: true, message: "Login successful", data: { access_token, infoUser } });
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new AuthenticationService();