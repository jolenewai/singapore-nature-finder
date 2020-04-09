// //foursquare clientid
// let clientId = "IRDBUTDRK0IU2A1O2LWFJPFUTNUSTQFZEOPP5QWVXOQ0LMDM"
// let clientSecret = "XX32BTHUQ3MU5QXPATTSHF4Z3ASR3VPE2W5F2FGZ21Z1B5ZW"

// //foursquare api base URL
// let foursquareURL = "https://api.foursquare.com/v2/venues/search"

// let natureCat = "4d4b7105d754a06377d81259"
// let foursquareParam = {
//         client_id: clientId, 
//         client_secret: clientSecret, 
//         near: "Singapore",
//         categoryId: natureCat,
//         v:"20200328"
// }

// let foursquareData = null

//Parks and NParks data from Data.gov.sg
let parksAPI = "/data/parks-geojson.geojson"
let nParksAPI = "/data/nparks-parks-geojson.geojson"
let cyclingAPI = "/data/cycling-path-network-geojson.geojson"
let treesAPI = "/data/heritage-trees-geojson.geojson"
let pcnAPI = "/data/park-connector-loop-geojson.geojson"
let nParksTracksAPI = "/data/nparks-tracks-geojson.geojson"
let parkDataAPI = "/data/park-data.csv"

// https://api.data.gov.sg/v1/environment/24-hour-weather-forecast?date_time=2020-04-01T23%3A50%3A00&date=2020-04-01
let weather2hrAPI = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"
let weather24hrAPI = "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast"

//https://data.gov.sg/dataset/ultraviolet-index-uvi

// declare variables for creating markers
let parks   
let nParks
let cyclingPath
let trees
let pcn
let nParksTracks
let parkData
let parksLayer
let nParksLayer
let treesLayer
let pcnLayer
let cyclingPathLayer
let nParksTracksLayer
let marker


let promises = [
    axios.get(parksAPI),
    axios.get(nParksAPI),
    axios.get(cyclingAPI),
    axios.get(treesAPI),
    axios.get(pcnAPI),
    axios.get(nParksTracksAPI),
    axios.get(parkDataAPI)
];


let parkObject = {}
let weather2hrLayer
let queryText
let query
