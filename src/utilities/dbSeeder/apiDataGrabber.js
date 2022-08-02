const fetch = require('node-fetch')
const appConfig = require('../../config/app.config')

async function getData(url, options = {}) {
    const request = await fetch(url, options)
    const data = await request.json()
    return data
}

async function generateAvatarImage() {
    const apiURL = 'https://this-person-does-not-exist.com/en?new='
    const imageSrc = (await getData(apiURL)).src
    return `https://this-person-does-not-exist.com${imageSrc}`
}

async function generateApartmentImage(page = 1, query = '') {
    // https://api.pexels.com/v1/search?query=apartment inside
    // query.replace(/ /g, '%20')
    const apiURL = `https://api.pexels.com/v1/search?per_page=80&orientation=landscape&page=${page}&query=${query}`
    console.log(apiURL)
    // console.l
    const options = { headers: { Authorization: appConfig.pexelsKey } }
    console.log(options)
    const { photos } = await getData(apiURL + query, options)
    console.log(photos)
    return photos
}

module.exports = { generateAvatarImage, generateApartmentImage }
