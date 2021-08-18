export const locService = {
    getLocs,
    getCoordsForLocation,
    getPosition,
    addLoc,
    getLocById,
    removeLoc
}

import { storageService } from './storage.service.js'

const KEY = 'locsDB';
let locId = 0;
const locs = storageService.load(KEY) || [];

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 500)
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

function addLoc(name, pos, weather) {
    locs.push({
        id: ++locId, name, lat: pos.lat, lng: pos.lng,
        weather, createdAt: Date.now(), updatedAt: Date.now()
    })
    storageService.save(KEY, locs)
}

function getLocById(locId) {
    return Promise.resolve(locs.find(loc => loc.id === locId))
}

function removeLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId)
    locs.splice(locIdx, 1)
    storageService.save(KEY, locs)
}