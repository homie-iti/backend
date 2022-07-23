/* eslint-disable quotes */
// import * as nodemailer from 'nodemailer'
const nodemailer = require('nodemailer')
const SMTPTransport = require('nodemailer/lib/smtp-transport')

require('dotenv').config()

// type EmailType =
//     | 'invoice_creation'
//     | 'appointment_creation'
//     | 'doctor_creation'
//     | 'employee_creation'
//     | 'patient_creation'

module.exports = class EmailClient {
    #account //!: { name: string; email: string }
    #transporter //!: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
    #message //!: { subject: string; body: string }

    constructor() {
        // console.log(process.env)

        const orgName = 'ITI Eyes Clinic 👁👃👁'
        const orgEmail = process.env.ORG_EMAIL || ''
        const orgPass = process.env.ORG_EMAIL_PASSWORD || ''

        this.#transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: orgEmail,
                pass: orgPass,
            },
        })

        this.#account = {
            name: orgName,
            email: orgEmail,
        }
    }

    #defineMessage(type, userName) {
        switch (type) {
            case 'user_creation':
                this.#message = {
                    subject: `Hola ${
                        userName.split(' ')[0]
                    }, your account is created ^^`,
                    body: `
                    <p>It's a message from Homie and we would like to thank you for creating an account 🎉.</p>
                    <p dir="rtl">تسلم يسطا و الله ربنا يكرمك ❤</p>
                    <p dir="rtl">إدارة هومي الموقّرة</p>
                    `,
                }
                break

            default:
                break
        }
    }

    async sendMessage(type, userName, userEmail) {
        console.log(type, userName, userEmail)
        this.#defineMessage(type, userName)
        const sendingInfo = await this.#transporter.sendMail({
            from: `${this.#account.name} < ${this.#account.email} >`,
            to: `${userName} < ${userEmail} >`,
            subject: this.#message.subject,
            html: this.#message.body,
        })

        console.log(sendingInfo)

        return (
            sendingInfo.accepted.length === 1 &&
            sendingInfo.accepted[0] === userEmail
        )
    }
}
