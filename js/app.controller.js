import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchedLocation = onSearchedLocation;

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

function onSearchedLocation(ev) {
    ev.preventDefault();
    const locationName = document.querySelector('[name=search-location]').value
    locService.getCoordsForLocation(locationName)
        .then(res => {
            mapService.panTo(res.lat, res.lng)
            mapService.addMarker({lat: res.lat, lng: res.lng})
        })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    locService.getPosition()
        .then(pos => {
            // console.log('User position is:', pos.coords.latitude, pos.coords.longitude);
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            mapService.addMarker({lat: pos.coords.latitude, lng: pos.coords.longitude})
            // document.querySelector('.user-pos').innerText =
            //     `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}