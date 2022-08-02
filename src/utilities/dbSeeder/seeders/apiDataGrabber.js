const fetch = require('node-fetch')

async function getData(url) {
    const request = await fetch(url)
    const data = await request.json()
    return data
}

async function generateAvatarImage() {
    const apiURL = 'https://this-person-does-not-exist.com/en?new='
    const imageSrc = (await getData(apiURL)).src
    return `https://this-person-does-not-exist.com${imageSrc}`
}

module.exports = { generateAvatarImage }
