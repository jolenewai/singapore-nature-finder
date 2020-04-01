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

// declare variables for creating markers
let parks
let nParks
let cyclingPath
let trees
let pcn
let nParksTracks
let parksLayer
let nParksLayer
let cyclingPathLayer
let marker

 let promises = [
            axios.get(parksAPI),
            axios.get(nParksAPI),
            axios.get(cyclingAPI),
            axios.get(treesAPI),
            axios.get(pcnAPI),
            axios.get(nParksTracksAPI)
        ];

$(function () {

    function clearMarkers() {
        if (parksLayer) {
            parksLayer.clearLayers()
        }

        if (nParksLayer) {
            nParksLayer.clearLayers()
        }
    }

    function getData() {
       
        axios.all(promises).then(axios.spread(function (parks, nparks, cyclingPath, trees, pcn, nParksTracks){
            displayResult(parks, nparks, cyclingPath, trees, pcn, nParksTracks)
        }))

        // axios.all(promises).then(axios.spread(function (parks, nparks, cyclingPath, trees, pcn, nParksTracks){
        //     return displayResult
        // }))

    }

    function displayResult(parks, nparks, cyclingPath, trees, pcn, nParksTracks) {
        
        clearMarkers()
        // getData()
        $('#details').empty()
        $('#search-result-header').empty()

        let query = $('#query').val()
        //console.log($('#park-area'))

        if ($('input[name="show-park"]:checked')) {
            let showMode = $('input[name="show-park"]:checked').val()
            if (showMode == 'area') {

                viewParksArea(nparks, query)
            } else {

                viewParks(parks, query)
            }
        }

        // let bound = parksLayer.getBounds(marker)
        // map.fitBounds(bound)

    }



    function viewParks(parks, query) {

        parksLayer = L.markerClusterGroup();

        let noOfResults = 0
        //console.log(parks.data)
        for (let n of parks.data.features) {
            let desc = n.properties.Description

            pName = $(desc).children().children().children().children().eq(14).text()
            // only show results with Park in the decription
            if (desc.indexOf(query) >= 0 || desc.indexOf(query) >= 0) {
                let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup(pName)

                parksLayer.addLayer(marker);
                noOfResults = noOfResults + 1;


                let searchResult = `
                        <a href="#${noOfResults}"></a>
                        <h5>${pName}</h5>
                        <div class="card border-0">
                            <img src="/images/bg_image1.jpg" class="card-img-top" alt="${pName}" width="390" height="225">
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
                <p class="p-3"> ${noOfResults} Search Results for <strong>${query}</strong></p>
            `
        $('#search-result-header').append(searchResultStr)

    }

    function viewParksArea(nparks, query) {
        //marking park areas
        nParksLayer = new L.geoJson(nparks.data, {
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                pName = $(desc).children().children().children().children().eq(4).text()
                layer.bindPopup(pName);
            }
        }).addTo(map);

        nParksLayer.setStyle({
            color: '#99A139',
            fillColor: '#476220',
            weight: 1,
            fillOpacity: 0.6
        })
    }

    function viewCyclingPath(cyclingPath, query) {
        //marking cycling path
        cyclingPathLayer = new L.geoJson(cyclingPath.data, {
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                //console.log($(desc).children().children().children().children())
                pName = $(desc).children().children().children().children().eq(2).text()
                layer.bindPopup(pName);
            }
        }).addTo(map)

        cyclingPathLayer.setStyle({
            color: '#563B28',
            // fillColor: 'red',
            weight: 2,
            Opacity: 0.3
        })
    }

    function viewNParksTracks(nParksTracks, query) {
        //mark nParksTracks
        nParksTracksLayer = new L.geoJson(nParksTracks.data, {
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                //console.log($(desc).children().children().children().children())
                //pName = 'Point A: '+ $(desc).children().children().children().children().eq(2).text()
                //pName = pName + '<br/>Point B: ' + $(desc).children().children().children().children().eq(4).text()
                layer.bindPopup(pName);
            }
        }).addTo(map)

        nParksTracksLayer.setStyle({
            color: '#196C00',
            // fillColor: 'red',
            weight: 2,
            Opacity: 0.5
        })

    }

    function viewTrees(trees, query) {

        // marking trees
        treesLayer = L.markerClusterGroup();

        for (let t of trees.data.features) {
            let desc = t.properties.Description

            pName = $(desc).children().children().children().children().eq(10).text()

            if (desc.indexOf(query) >= 0 || desc.indexOf(query) >= 0) {
                let marker = L.marker([t.geometry.coordinates[1], t.geometry.coordinates[0]], { icon: tree2Icon }).bindPopup(pName)
                treesLayer.addLayer(marker);
            }

        }

        treesLayer.addTo(map)
    }

    function viewPCN(pcn, query) {

        //mark park connector
        pcnLayer = new L.geoJson(pcn.data, {
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                pName = 'Point A: ' + $(desc).children().children().children().children().eq(2).text()
                pName = pName + '<br/>Point B: ' + $(desc).children().children().children().children().eq(4).text()
                layer.bindPopup(pName);
            }
        }).addTo(map)

        pcnLayer.setStyle({
            color: '#D49683',
            // fillColor: 'red',
            weight: 2,
            Opacity: 0.5
        })

    }

     

    $('#btn-search-home').click(function () {

        axios.get('/results.html').then(function (response) {
            window.location = '/results.html'
            displayResult()
        })

    })
    $('#btn-search').click(getData)

    $('#btn-change').click(getData)
    $('#btn-refresh').click(getData)

    //getData(promises, displayResult)




})