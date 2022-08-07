const fetch = require('node-fetch')
const appConfig = require('../../config/app.config')

async function getData(url, options = {}) {
    const request = await fetch(url, options)
    const data = await request.json()
    return data
}

async function generateAvatarImage(page = 1, query = '') {
    // https://api.unsplash.com/search/photos?page=1&query=human&content_filter=high&orientation=squarish&per_page=30
    const apiURL = `https://api.unsplash.com/search/photos?per_page=30&content_filter=high&orientation=squarish&page=${page}&query=${query}`
    // console.log(apiURL)
    const options = {
        headers: {
            Authorization: appConfig.unsplashKey,
            'Accept-Version': 'v1',
        },
    }
    // console.log(options)
    const { results } = await getData(apiURL, options)
    // console.log(results)
    return results
}

async function generateApartmentImage(page = 1, query = '') {
    // https://api.pexels.com/v1/search?query=apartment inside
    // query.replace(/ /g, '%20')
    const apiURL = `https://api.pexels.com/v1/search?per_page=80&orientation=landscape&page=${page}&query=${query}`
    // console.log(apiURL)
    // console.l
    const options = { headers: { Authorization: appConfig.pexelsKey } }
    // console.log(options)
    const { photos } = await getData(apiURL, options)
    // console.log(photos)
    return photos
}

async function generateCityImage(query = '') {
    // https://api.pexels.com/v1/search?query=apartment inside
    // query.replace(/ /g, '%20')
    const apiURL = `https://api.pexels.com/v1/search?per_page=1&orientation=landscape&query=${query}`
    // console.log(apiURL)
    // console.l
    const options = { headers: { Authorization: appConfig.pexelsKey } }
    // console.log(options)
    const { photos } = await getData(apiURL, options)
    // console.log(photos)
    return photos
}

module.exports = {
    generateAvatarImage,
    generateApartmentImage,
    generateCityImage,
}
