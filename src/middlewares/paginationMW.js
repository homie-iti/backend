const paginationResult = (model) => async (request, response, next) => {
    // console.log(!request.query.page)
    if (!request.query.page && !request.query.limit) {
        try {
            const dataResulted = await model.find()
            response.dataResulted = { dataResulted }
            next()
        } catch (error) {
            next(error)
        }
    } else {
        const { page, limit } = request.query
        // console.log(`Query is pageno:${page} limit:${limit} `)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        // console.log(`start:${startIndex} end:${endIndex}`)

        const dataResulted = {}
        if (endIndex < (await model.countDocuments())) {
            dataResulted.nextPage = parseInt(page) + 1
        }
        if (startIndex > 0) {
            dataResulted.previousPage = page - 1
        }
        try {
            dataResulted.data = await model.find().limit(limit).skip(startIndex)

            response.dataResulted = { dataResulted }

            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = paginationResult
