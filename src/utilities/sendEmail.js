/* eslint-disable quotes */
// import * as nodemailer from 'nodemailer'
const nodemailer = require('nodemailer')
const SMTPTransport = require('nodemailer/lib/smtp-transport')

const appConfig = require('../config/app.config')
const dbConfig = require('../config/database.config')

// require('dotenv').config()

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
        const orgEmail = appConfig.orgEmail || ''
        const orgPass = appConfig.orgEmailPassword || ''

        console.log(orgEmail)
        console.log(orgPass)

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
        const appWebsiteHost =
            appConfig.environment === 'prod'
                ? 'https://homie-iti.herokuapp.com'
                : 'http://localhost:8080'

        switch (event) {
            case 'user_signup':
                const activationLink =
                    appWebsiteHost + '/activate-account/' + configs.slug
                this.#message = {
                    subject: `Hola ${
                        configs.name.split(' ')[0]
                    }, your account is created ^^`,
                    body: `
                    <p>It's a message from Homie and we would like to thank you for creating an account 🎉.</p>
                    <p>Your account activation link is
                    <a href=${activationLink}>${activationLink}</a>
                    </p>
                    <p>Have a nice day.</p>
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
                    <p>Have a nice day.</p>
                    <p dir="rtl">إدارة هومي الموقّرة</p>
                        `,
                }
                break

            case 'reset_password':
                const resetPasswordLink =
                    appWebsiteHost + '/reset-password/' + configs.resetLink
                this.#message = {
                    subject: `Reset your forgotten password `,
                    body: `
                        <h2>Reset your forgotten password</h2>
                        <p>You are receiving this e-mail because you have requested a password reset.</p>
                        <p> Password reset code: ${configs.resetLink}
                        </p>
                        <p>If you did not request this password reset, then please ignore this email.</p>
                        <p>Have a nice day.</p>
                        <p dir="rtl">إدارة هومي الموقّرة</p>                        `,
                }
                break

            case 'password_changed':
                this.#message = {
                    subject: `Hola ${
                        configs.name.split(' ')[0]
                    }, Password has been changed successfully`,
                    body: `
                    <h2>Password changed successfully</h2>
                    <p>Your password has been changed successfully... you can now try to login again.</p>
                    <p>Have a nice day.</p>
                    <p dir="rtl">إدارة هومي الموقّرة</p>
                    `,
                }
                break

            case 'book_unit':
                // const  =
                // appWebsiteHost + '/reset-password/' + configs.resetLink
                const unitLink = 'https://homie-iti.vercel.com/units/'
                this.#message = {
                    subject: `Hola ${
                        configs.name.split(' ')[0]
                    }, Confirm booking a unit `,
                    body: `
                    <h2>Confirm booking a unit</h2>
                    <p>Someone needs to book a unit of yours. Please see the contract details below and then confirm or cancel it.</P>
                    <h2>Unit: ${unitLink}${
                        configs.contractDetails.contractData.unitId
                    }</h2>
                    <h2>Rental Start: ${
                        new Date(
                            configs.contractDetails.contractData.rentalStart
                        ).getDate() +
                        '/' +
                        (new Date(
                            configs.contractDetails.contractData.rentalStart
                        ).getMonth() +
                            1) +
                        '/' +
                        new Date(
                            configs.contractDetails.contractData.rentalStart
                        ).getFullYear()
                    }</h2>
                    <h2>Rental End: ${
                        new Date(
                            configs.contractDetails.contractData.rentalEnd
                        ).getDate() +
                        '/' +
                        (new Date(
                            configs.contractDetails.contractData.rentalEnd
                        ).getMonth() +
                            1) +
                        '/' +
                        new Date(
                            configs.contractDetails.contractData.rentalEnd
                        ).getFullYear()
                    }</h2>
                    <h2>Money you will get: ${
                        configs.contractDetails.contractData.totalAmount
                    }</h2>
                    <h2>Payment Method: ${
                        configs.contractDetails.contractData.paymentMethod
                    }</h2>

                    <h3>For more details about the agent, you can contact him/her through</h3>
                       
                    <h4>AgentName: ${configs.contractDetails.agentName}</h4>

                    <h4>AgentPhone: ${
                        configs.contractDetails.agentPhoneNumber
                    }</h4>

                    <h4>AgentEmail: ${configs.contractDetails.agentEmail}</h4>


                    <a href="${appWebsiteHost}/confirm-booking/${
                        configs.contractDetails.contractData._id
                    }" >Confirm</a>
                    <a href="${appWebsiteHost}/cancel-booking/${
                        configs.contractDetails.contractData._id
                    }">Cancel</a>

                    <p>Have a nice day.</p>
                    <p dir="rtl">إدارة هومي الموقّرة</p>

                            `,
                }
                break

            case 'confirm_booking_unit':
                this.#message = {
                    subject: `Hola ${
                        configs.name.split(' ')[0]
                    }, Landlord Confirm your unit booking `,
                    body: `
                    <h2>Landlord Confirm your unit booking</h2>
                    <p>Congratulations. The landlord of the unit you need to book has successfully confirmed the booking.</P>
    
                    <h3>For more details about the landlord, you can contact him/her through</h3>
                           
                    <p>LandlordName:${configs.agentDetails.landlordName}</p>
    
                    <p>LandlordPhone:${configs.agentDetails.landlordPhoneNumber}</p>
    
                    <p>LandlordEmail:${configs.agentDetails.landlordEmail}</p>

                    <p>Have a nice day.</p>
                    <p dir="rtl">إدارة هومي الموقّرة</p>
                    `,
                }
                break

            case 'cancel_booking_unit':
                this.#message = {
                    subject: `Hola ${
                        configs.name.split(' ')[0]
                    }, Landlord Cancel your unit booking `,
                    body: `
                    <h2>Landlord Canceled your booking a unit</h2>
                    <h3>Sorry, but the landlord has cancelled your reservation for a unit..</h3>
        
                    <h3>You can log in to our website and choose another unit that suits you.</h3>
                    <p>Have a nice day.</p>
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
