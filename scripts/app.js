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

let parks
let nParks
// create the markers for nature
let parksLayer = L.markerClusterGroup();
let marker

$(function () {

    function displayResult() {
        let promises = [axios.get(parksAPI), axios.get(nParksAPI)];
        axios.all(promises).then(axios.spread(function (parks, nparks) {

            let query = $('#query').val()

            parksLayer.clearLayers()
            let noOfResults = 0
            for (let n of parks.data.features) {
                let desc = n.properties.Description

                pName = $(desc).children().children().children().children().eq(14).text()
                // only show results with Park in the decription
                if (desc.indexOf($('#query').val()) >= 0 || desc.indexOf($('#query-home').val()) >= 0) {
                    let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup(pName)
                    
                    parksLayer.addLayer(marker);
                    noOfResults = noOfResults + 1;

                    let searchResult = `
                        <h5>${pName}</h5>
                        <div class="card border-0">
                            <img src="..." class="card-img-top" alt="..." width="390" height="225">
                            <h6>Getting There:</h6>
                            <p>Alight at Labrador Park MRT station</p>

                            <h6>Nature Reserve opening hours:</h6>
                            <p>7:00 am to 7:00 pm daily (entering or remaining in the nature reserve after 7:00pm is not allowed)</p>

                            <h6>Park and Berlayer Creek lighting hours:</h6>
                            <p>7:00 pm to 7:00 am daily</p>

                            <h6>Accessibility:</h6>
                            <p>Wheelchair accessible</p>

                            <p>No smoking Smoke-free park</p>
                        </div>
                        <hr />
                    `
                    $('#details').append(searchResult)
                }
            }

            parksLayer.addTo(map)

            let searchResultStr = `
                <p class="p-3"> ${noOfResults} Search Results for ${query}</p>
            `
            $('#search-result-header').empty()
            $('#search-result-header').append(searchResultStr)


            // let bound = parksLayer.getBounds(marker)
            // map.fitBounds(bound)
            // let nParksLayer = L.geoJson(nparks.data, {
            //     onEachFeature: (feature, layer) => {
            //         desc = feature.properties.Description
            //         pName = $(desc).children().children().children().children().eq(4).text()

            //         layer.bindPopup(pName);
            //     }
            // }).addTo(map);

            // nParksLayer.setStyle({
            //     color: '#99A139',
            //     fillColor: '#476220',
            //     weight: 1,
            //     fillOpacity: 0.75
            // })

        }));



    }



    $('#btn-search-home').click(function () {

        axios.get('/results.html').then(function (response) {

            window.location = '/results.html'
            displayResult()

        })

    })
    $('#btn-search').click(displayResult)


})