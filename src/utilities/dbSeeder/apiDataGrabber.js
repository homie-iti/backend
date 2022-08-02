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

async function generateApartmentImage() {
    // https://api.pexels.com/v1/search?query=apartment inside
    const apiURL =
        'https://api.pexels.com/v1/search?per_page=80&orientation=landscape&query='
    const query = 'apartment inside'
    const options = { headers: { Authorization: appConfig.pexelsKey } }
    const imageSrc = await getData(apiURL + query, options)
    console.log(imageSrc)
    // return `https://this-person-does-not-exist.com${imageSrc}`
}

module.exports = { generateAvatarImage, generateApartmentImage }
