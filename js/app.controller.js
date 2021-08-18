import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onGetUserPos = onGetUserPos;
window.onSearchedLocation = onSearchedLocation;
window.onMapClicked = onMapClicked;
window.onGoToLoc = onGoToLoc;
window.onRemoveLoc = onRemoveLoc;
window.onCopyURL = onCopyURL;

function onInit() {
    renderLocs()
    // let params = new URLSearchParams(window.location.search);
    let params = (new URL(document.location)).searchParams;
    console.log('params: ', params)
    if (!params) mapService.initMap()
    else mapService.initMap(params.lat, params.lng)
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
            mapService.addMarker({ lat: res.lat, lng: res.lng }, locationName)
            locService.addLoc(locationName, res, 'weather here')
            renderLocs()
        })
}

function onGetUserPos() {
    locService.getUserPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            document.querySelector('.user-pos span').innerText =
                `Latitude: ${pos.coords.latitude.toFixed(7)} - Longitude: ${pos.coords.longitude.toFixed(7)}`
            document.querySelector('.user-pos').hidden = false
            locService.setCurrPos({lat: pos.coords.latitude, lng: pos.coords.longitude})
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onCopyURL() {
    const currPos = locService.getCurrPos()
    const lat = currPos.lat
    const lng = currPos.lng
    console.log('copyURL pos:', lat, lng)
    const url = `https://matanriba.github.io/Travel-tip/?lat=${lat}&lng=${lng}`
    navigator.clipboard.writeText(url);
}

function onMapClicked() {
    renderLocs()
}

function renderLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            let strHtml
            if (locs.length) {
                strHtml = locs.map(loc => {
                    return `
                    <tr>
                        <td>${loc.name}</td>
                        <td>${loc.lat.toFixed(7)}</td>
                        <td>${loc.lng.toFixed(7)}</td>
                        <td>${loc.weather}</td>
                        <td>${new Date(loc.createdAt).toUTCString()}</td>
                        <td><button onclick="onGoToLoc(${loc.id})">Go</button></td>
                        <td><button onclick="onRemoveLoc(${loc.id})">Delete</button></td>
                        </tr>
                        `
                }).join('')
                document.querySelector('.my-locations thead').hidden = false

            } else strHtml = 'no locations yet'
            document.querySelector('.my-locations tbody').innerHTML = strHtml
        })
}

function onGoToLoc(locId) {
    //remove old marker based on currPos
    locService.getLocById(locId)
        .then(loc => {
            mapService.panTo(loc.lat, loc.lng)
            mapService.addMarker({ lat: loc.lat, lng: loc.lng }, loc.name)
        })
}

function onRemoveLoc(locId) {
    locService.removeLoc(locId)
    renderLocs()
}