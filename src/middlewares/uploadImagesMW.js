const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadImage = (folderName) => {
    const storageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
            const location = path.join(
                `./src/uploads/${folderName}/`,
                req.params.id.toString()
            )
            fs.mkdir(location, { recursive: true }, (err) => {
                if (err) {
                    return console.error(err)
                }
                console.log('Directory created successfully!')
            })
            cb(null, location)
        },
        // destination: `./src/uploads/${folderName}/`,
        filename: (req, file, cb) => {
            cb(
                null,
                file.fieldname +
                    '_' +
                    Date.now() +
                    path.extname(file.originalname)
            )
        },
    })

    const upload = multer({
        storage: storageEngine,
        limits: {
            fileSize: 2000000,
        },
        fileFilter: (req, file, cb) => {
            file.originalname = file.originalname.toLowerCase()
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/)) {
                return cb(new Error('Please Upload Image'))
            }
            cb(null, true)
        },
    })

    return upload
}

module.exports = uploadImage
