const dotenv = require('dotenv')

dotenv.config()

const appConfig = {
    environment: process.env.ENV?.trim() || 'dev',
    port: Number(process.env.PORT) || 8080,
    jwtSecret: process.env.secret, // TODO name it in the vars file -> process.env.JWT_SECRET,
    bcryptSalt: Number(process.env.SALT_ROUNDS) || 10,
    // bcryptPaper: process.env.BCRYPT_PASSWORD,
    orgEmail: process.env.ORG_EMAIL,
    orgEmailPassword: process.env.ORG_EMAIL_PASSWORD,
}

module.exports = appConfig
