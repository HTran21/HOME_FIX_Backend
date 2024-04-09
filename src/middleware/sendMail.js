const nodemailer = require("nodemailer");

async function sendEmail(to, subject, htmlContent) {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "tranhoangtran22226@gmail.com",
                pass: "fjwn cylp iemu hupx",
            },
        });

        await transporter.sendMail({
            from: "tranhoangtran22226@gmail.com",
            to: to,
            subject: subject,
            html: htmlContent,
        });

        return { success: true, message: `Đã gửi mail thành công cho địa chỉ email ${to}` };
    } catch (error) {
        console.log("Lỗi", error);
        throw error;
    }
}


module.exports = sendEmail