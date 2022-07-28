const dotenv = require('dotenv')

dotenv.config()

const appConfig = {
    environment: process.env.ENV || 'dev',
    port: Number(process.env.PORT) || 8080,
    // jwtSecret: process.env.JWT_TOKEN,
    // bcryptSalt: Number(process.env.SALT_ROUNDS) || 10,
    // bcryptPaper: process.env.BCRYPT_PASSWORD,
    email: process.env.ORG_EMAIL,
    emailPassword: process.env.ORG_EMAIL_PASSWORD,
}

module.exports = appConfig
