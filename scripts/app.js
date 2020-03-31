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
let sgAPI = "/data/national-map-polygon-geojson.geojson"
let parks
let nParks
let sgmap
$(function () {

    function getName() {
        console.log()
        $('div.leaflet-popup-content').onLoad(function () {
            for (let p of ($('div.leaflet-popup-content'))) {
                console.log(p)
                if (p.hidden == false) {

                    let allCol = p.find('td')
                    console.log(allCol)

                    let parkname = allCol[6]
                }
            }
        })
    }



    let promises = [axios.get(parksAPI), axios.get(nParksAPI), axios.get(sgAPI)];
axios.all(promises).then(axios.spread(function (parks, nparks, sgmap) {

    // let sgmapLayer = L.geoJson(sgmap.data,{
    //     onEachFeature:(feature, layer) => {
    //         layer.bindPopup(feature.properties.Description);
    //     }
    // }).addTo(map);

    // sgmapLayer.setStyle({
    //     color:'#707070',
    //     fill: '#707070',
    //     stroke: false,
    //     opacity: 1.0
    // })

    // create the markers for nature
    let parksLayer = L.layerGroup();
    for (let n of parks.data.features) {
        let desc = n.properties.Description
        // only show results with Park in the decription
        if (desc.indexOf("Park") >= 0 && desc.indexOf("nparks") >= 0) {
            let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup(desc)
            parksLayer.addLayer(marker);
        }
    }

    parksLayer.addTo(map)

    let nParksLayer = L.geoJson(nparks.data, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(feature.properties.Description);
        }
    }).addTo(map);

    nParksLayer.setStyle({
        color: '#99A139',
        fillColor: '#476220',
        weight: 1,
        fillOpacity: 0.75
    })

    $('.leaflet-marker-icon').click(getName)






}));




})