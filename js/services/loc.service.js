export const locService = {
    getLocs,
    getCoordsForLocation,
    getPosition
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

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

function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
