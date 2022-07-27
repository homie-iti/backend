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

        const orgName = 'Homie 🏠'
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

    #defineMessage(event, configs) {
        switch (event) {
            case 'user_signup':
                const activationLink =
                    'http://localhost:8080/activate-account/' + configs.slug
                this.#message = {
                    subject: `Hola ${
                        configs.name.split(' ')[0]
                    }, your account is created ^^`,
                    body: `
                    <p>It's a message from Homie and we would like to thank you for creating an account 🎉.</p>
                    <p>Your account activation link is
                    <a href=${activationLink}>${activationLink}</a>
                    </p>
                    <p dir="rtl">تسلم يسطا و الله ربنا يكرمك ❤</p>
                    <p dir="rtl">إدارة هومي الموقّرة</p>
                    `,
                }
                break

            case 'account_activated':
                this.#message = {
                    subject: `Hola ${
                        configs.name.split(' ')[0]
                    }, your account is activated ^^`,
                    body: `
                        <p>Yaaay, Your account is activated 🎉.</p>
                        <p>Now you can login and start your journey
                    <a href="https://homie-iti.vercel.app">https://homie-iti.vercel.app</a>
                    </p>
                        <p dir="rtl">تسلم يسطا و الله ربنا يكرمك ❤</p>
                        <p dir="rtl">إدارة هومي الموقّرة</p>
                        `,
                }
                break

            default:
                break
        }
    }

    async sendMessage(event, configs) {
        // const userName = userInfo.fullName
        console.log(event)
        console.log(configs)
        this.#defineMessage(event, configs)
        const sendingInfo = await this.#transporter.sendMail({
            from: `${this.#account.name} < ${this.#account.email} >`,
            to: `${configs.name} < ${configs.email} >`,
            subject: this.#message.subject,
            html: this.#message.body,
        })

        console.log(sendingInfo)

        return (
            sendingInfo.accepted.length === 1 &&
            sendingInfo.accepted[0] === configs.email
        )
    }
}
