const nodemailer = require('nodemailer');

// configuring emailService using SendinBlue SMTP
async function sendMail({ from, to, subject, text, html }) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({from: `Preshak <${from}>`,to,subject,text,html }); 
    console.log(info);
}

module.exports = sendMail;
