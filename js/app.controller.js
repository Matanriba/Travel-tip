import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = renderLocs;
window.onGetUserPos = onGetUserPos;
window.onAddLoc = onAddLoc;

function onInit() {
    renderLocs()
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

function onAddMarker() {
    console.log('Adding a marker');
    // mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
    renderLocs()
}

function renderLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            const strHtml = locs.map(loc => {
                return `
                    <tr>
                        <td>${loc.name}</td>
                        <td>${loc.lat}</td>
                        <td>${loc.lng}</td>
                        <td>${loc.weather}</td>
                        <td>${loc.createdAt}</td>
                        <td>${loc.updatedAt}</td>
                    </tr>
                `
            }).join('')
            document.querySelector('.my-locations tbody').innerHTML = strHtml
        })
}
// [
//     {
//         id: ++locId, name: 'Place 1', lat: 32.047104, lng: 34.832384,
//         weather: 'nice 😎 26C', createdAt: Date.now(), updatedAt: Date.now()
//     },
//     {
//         id: ++locId, name: 'Tel Mond', lat: 32.256819, lng: 34.917581,
//         weather: 'hot 🥵 32C', createdAt: Date.now(), updatedAt: Date.now()
//     },
// ]

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}