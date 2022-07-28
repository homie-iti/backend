const paginationResult = (model) => async (request, response, next) => {
    // console.log(!request.query.page)
    if (!request.query.page && !request.query.limit) {
        try {
            const dataResulted = await model.find()

            response.data = { dataResulted }
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

        const resultingData = {}
        if (endIndex < (await model.countDocuments())) {
            resultingData.nextPage = parseInt(page) + 1
        }
        if (startIndex > 0) {
            resultingData.previousPage = page - 1
        }
        try {
            resultingData.dataResulted = await model
                .find()
                .limit(limit)
                .skip(startIndex)

            response.status(200).json(resultingData)
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = paginationResult
