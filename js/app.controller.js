import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = renderLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchedLocation = onSearchedLocation;
window.onAddLoc = onAddLoc;

function onInit() {
    renderLocs()
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