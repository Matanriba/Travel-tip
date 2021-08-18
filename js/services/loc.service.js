export const locService = {
    getLocs,
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

function addLoc(name, lat, lng, weather) {
    locs.push({
        id: ++locId, name, lat, lng,
        weather, createdAt: Date.now(), updatedAt: Date.now()
    })
    console.log('locs:', locs)
    storageService.save(KEY, locs)
}