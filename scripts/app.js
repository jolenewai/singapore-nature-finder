
let promises = [
    axios.get(parksAPI),
    axios.get(nParksAPI),
    axios.get(cyclingAPI),
    axios.get(treesAPI),
    axios.get(pcnAPI),
    axios.get(nParksTracksAPI),
    axios.get(parkDataAPI)
];

$(function () {


    function getData(){
        getApi(displaySearchResults)
    }

    function getApi(callback){

        axios.all(promises).then(axios.spread(function (parks, nparks, cyclingPath, trees, pcn, nParksTracks, parkData) {
            csv().fromString(parkData.data).then(function (pData) {
                //console.log(pData)
                callback(parks, nparks, cyclingPath, trees, pcn, nParksTracks, pData)

            })
        }))


        // axios.get(apiURL).then(function(response){
        //     callback(response) 
        // })

    }

    function getMarkers(n){

        let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup('<i class="fas fa-seedling pr-2"></i> ' + pName)
        parksLayer.addLayer(marker);  
           
    }



    function displaySearchResults(parks, nparks, cyclingPath, trees, pcn, nParksTracks, parkData){
        
        clearMarkers()
        $('#details').empty()
        $('#search-result-header').empty()

        let query = $('#query').val()
        let noOfResults = 0
 

        if ($('input[name="show-park"]:checked')) {
            let showMode = $('input[name="show-park"]:checked').val()
            if (showMode == 'area') {

                viewParksArea(nparks, query)
            } else {
                viewParks(parks, query, parkData)
            }
        }

        if ($('input[name="show-layers"]:checked')) {

            let checkboxes = $('input[name="show-layers"]:checked')

            checkboxes.each(function () {
                let option = $(this).val()

                if (option == 'cycling') {
                    viewCyclingPath(cyclingPath, query)
                } else if (option == 'trees') {
                    viewTrees(trees, query)
                } else if (option == 'pcn') {
                    viewPCN(pcn, query)
                } else if (option == 'tracks')
                    viewNParksTracks(nParksTracks, query)
            })

        }

    }
    

    function clearMarkers() {
        if (parksLayer) {
            parksLayer.clearLayers()
        }

        if (nParksLayer) {
            nParksLayer.clearLayers()
        }

        if (treesLayer) {
            treesLayer.clearLayers()
        }

        if (pcnLayer) {
            pcnLayer.clearLayers()
        }

        if (cyclingPathLayer) {
            cyclingPathLayer.clearLayers()
        }

        if (nParksTracks) {
            nParksTracks.clearLayers()
        }
    }

    function getWeather() {

        let date_time = moment().format()
        let date = moment().format('YYYY-MM-DD')
        console.log(date_time)
        console.log(date)

        params = {
            date_time, date
        }

        axios.get(weather24hrAPI, { params }).then(function (response) {
            displayWeather(response.data)
            
        })

    }

    function displayWeather(weatherData){
        let forecast = weatherData.items[0].general.forecast
            let lowTemp = weatherData.items[0].general.temperature.low
            let highTemp = weatherData.items[0].general.temperature.high

            let aveTemp = Math.floor((lowTemp + highTemp) / 2)

            let weatherText = `
                <div class="p-5">
                    <h3 class="bluetext mb-3">Weather in Singapore<br/><small>24 Hours Forecast</small></h3>
                    
                    <span class="weatherText">${forecast} </span>
                    <p>Temperature in Average</br>
                    <span class="tempNumber pt-0">
                    ${aveTemp}<span class="tempDegree"><sup>°C</sup></span>
                    </span><br/>
                    <span class="highlow">
                        <small><sup><i class="fas fa-temperature-low"></i></sup> </small>${lowTemp} / <small><sup><i class="fas fa-temperature-high"></i></sup></small> ${highTemp}
                    </span>
                </div>
            `

            $('#weather').empty()
            $('#weather').append(weatherText)
    }


    function viewParks(parks, query, parkData) {

        parksLayer = L.markerClusterGroup();

        let noOfResults = 0
        //console.log(parks.data)
        for (let n of parks.data.features) {
            let desc = n.properties.Description
            let parkDetails
            pName = $(desc).children().children().children().children().eq(14).text()

            // only show results with Park in the decription
            if (desc.indexOf(query) >= 0 || desc.indexOf(query) >= 0) {
                getMarkers(n)

                noOfResults = noOfResults + 1;

                let location = ""
                console.log(pName)
                for (let p of parkData) {
                    if (p["Park Name"] == pName) {

                        location = p.Location
                        accessibility = p.Accessibility

                        parkDetails = `
                        <div class="card border-0">
                            <img src="/images/park_images/${p["Park ID"]}.jpg" class="card-img-top" alt="${pName}" width="390" height="225">
                            <h6>Location:</h6>
                            <p>${location}</p>

                            <h6>Accessibility:</h6> 
                            <p>${accessibility}</p>
                        </div>
                        `
                    }
                }

                if (location == "") {
                    parkDetails = ""
                }

                let searchResult = `
                        <a href="#${noOfResults}"></a>
                        <h6 class="bluetext"><i class="fas fa-seedling pr-2"></i> <a href="#" class="result-name">${pName}</a></h6>
                        ${parkDetails}
                        <hr />
                    `    
                $('#details').append(searchResult)

            }
        }

        parksLayer.addTo(map)

        //map.flyToBounds(marker.latLngBounds())

        let searchResultStr = `
                <p class="p-3"> ${noOfResults} Search Results for <strong>${query}</strong></p>
            `
        $('#search-result-header').append(searchResultStr)

    }

    function viewParksArea(nparks, query) {

        nParksLayer = new L.geoJson(nparks.data, {
            filter: (feature, layer) => {
                desc = feature.properties.Description.toLowerCase()
                return desc.indexOf(query) >= 0
            }, onEachFeature: (feature, layer) => {
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
            filter: (feature, layer) => {
                desc = feature.properties.Description.toLowerCase()
                return desc.indexOf(query) >= 0
            },
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
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
            filter: (feature, layer) => {
                desc = feature.properties.Description.toLowerCase()
                return desc.indexOf(query) >= 0
            },
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                //console.log($(desc).children().children().children().children())
                pName = $(desc).children().children().children().children().eq(2).text()
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


    //assign function to buttons
    $('#btn-search').click(getData)
    //$(input['radio']['name="show-park"']).change(getData)
    $('#btn-change').click(getData)
    $('#btn-refresh').click(getData)

    getWeather()

    


})