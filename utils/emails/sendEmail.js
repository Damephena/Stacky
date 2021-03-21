const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
    try {
        const transporter = await nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            auth: {
                user: process.env.EMAIL_HOST_USER,
                pass: process.env.EMAIL_HOST_PASSWORD
            },
        })

        const source = await fs.readFileSync(path.join(__dirname, template), 'utf8')
        const compiledTemplate = await handlebars.compile(source)
        const options = () => {
            return {
                from: process.env.EMAIL_HOST_USER,
                to: email,
                subject: subject,
                html: compiledTemplate(payload)
            }
        }

        transporter.sendMail(options(), (error, info) => {
            if (error) {
                return error
            }
            else{
                return res.status(200).json({ 
                    detail: 'Email sent!',
                    info: info
                })
            }
        })
    }
    catch (err) {
        return {detail: err.message}
    }
}

module.exports = sendEmail
