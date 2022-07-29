const dotenv = require('dotenv')
const mongoosePaginate = require('mongoose-paginate-v2')

dotenv.config()

const appConfig = {
    environment: process.env.ENV.trim() || 'dev',
    port: Number(process.env.PORT) || 8080,
    // jwtSecret: process.env.JWT_TOKEN,
    // bcryptSalt: Number(process.env.SALT_ROUNDS) || 10,
    // bcryptPaper: process.env.BCRYPT_PASSWORD,
    email: process.env.ORG_EMAIL,
    emailPassword: process.env.ORG_EMAIL_PASSWORD,
}

mongoosePaginate.paginate.options = {
    lean: false,
    limit: 15,
}
module.exports = appConfig
