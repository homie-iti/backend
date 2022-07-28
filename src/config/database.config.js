const dotenv = require('dotenv')
const appConfig = require('./app.config')

dotenv.config()
const APP_ENV = appConfig.environment || 'dev'

const databaseName =
    process.env[APP_ENV.includes('test') ? 'TEST_DB_NAME' : 'DB_NAME']
const databaseHost =
    process.env[
        ['prod', 'testProd'].includes(APP_ENV) ? 'ATLAS_DB_HOST' : 'DB_HOST'
    ]
const databasePort =
    process.env[
        ['prod', 'testProd'].includes(APP_ENV) ? 'ATLAS_DB_PORT' : 'DB_PORT'
    ] || null
const databaseUsername =
    process.env[
        ['prod', 'testProd'].includes(APP_ENV) ? 'ATLAS_DB_USER' : 'DB_USER'
    ] || ''
const databasePassword =
    process.env[
        ['prod', 'testProd'].includes(APP_ENV)
            ? 'ATLAS_DB_PASSWORD'
            : 'DB_PASSWORD'
    ] || ''

const databaseConfig = {
    name: databaseName,
    host: databaseHost,
    port: databasePort,
    username: databaseUsername,
    password: databasePassword,
}

module.exports = databaseConfig
