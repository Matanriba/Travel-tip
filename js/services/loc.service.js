export const locService = {
    getLocs,
    getCoordsForLocation,
    getPosition,
    addLoc
}

import { storageService } from './storage.service.js'

const KEY = 'locsDB';
let locId = 0;

let locs = storageService.load(KEY) || [];
if (!locs.length) {
    addLoc('Tel Mond', 32.256819, 34.917581, 'hot 🥵 32C')
    // this should be addLoc(userPosition)
}
storageService.save(KEY, locs)

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getCoordsForLocation(locationName) {
    const API_KEY = 'AIzaSyAv0z0kluHOlPZ3wjET1G7VByf9cI24UIY';
    console.log(locationName)
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${API_KEY}`)
        .then(res => res.data.results[0].geometry.location)
        .catch(err => {
            throw new Error(err)
        })      
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition

function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function addLoc(name, lat, lng, weather) {
    locs.push({
        id: ++locId, name, lat, lng,
        weather, createdAt: Date.now(), updatedAt: Date.now()
    })
    console.log('locs:', locs)
    storageService.save(KEY, locs)
}
