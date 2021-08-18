export const locService = {
    getLocs,
    getCoordsForLocation,
    getUserPosition,
    addLoc,
    getLocById,
    removeLoc,
    setCurrPos,
    getCurrPos
}

import { storageService } from './storage.service.js'

const KEY = 'locsDB';
const locs = storageService.load(KEY) || [];
let locId = 0;
let currPos

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
        .catch(() => {
            // alert('Cannot find location!!')
            throw new Error('Cannot find location!!')
        })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition

function getUserPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function addLoc(name, pos, weather) {
    const loc = {
        id: ++locId, name, lat: pos.lat, lng: pos.lng,
        weather, createdAt: Date.now(), updatedAt: Date.now()
    }
    currPos = { lat: loc.lat, lng: loc.lng }
    console.log('curPos:', currPos)
    locs.push(loc)
    storageService.save(KEY, locs)
}

function getLocById(locId) {
    const loc = locs.find(loc => loc.id === locId)
    currPos = { lat: loc.lat, lng: loc.lng }
    console.log('curPos:', currPos)
    return Promise.resolve(loc)
}

function removeLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId)
    locs.splice(locIdx, 1)
    storageService.save(KEY, locs)
}

function setCurrPos(pos) {
    currPos = pos
    console.log('curPos:', currPos)
}

function getCurrPos(){
    return currPos
}