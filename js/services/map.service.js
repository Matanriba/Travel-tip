export const mapService = {
    initMap,
    addMarker,
    panTo
}

import { locService } from './loc.service.js'

var gMap;

// init coords should be userPosition...
function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    locService.setCurrPos({lat, lng})
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            addMapClickHandler()
        })
}

function addMapClickHandler() {
    gMap.addListener("click", (mapsMouseEvent) => {
        const clickedPos = mapsMouseEvent.latLng.toJSON()
        console.log('clicked pos:', clickedPos)
        const name = prompt('location name?')
        if (name) {
            addMarker(clickedPos, name)
            locService.addLoc(name, clickedPos, 'weather will come here')
        }
    })
}

function addMarker(loc, title) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAv0z0kluHOlPZ3wjET1G7VByf9cI24UIY'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}