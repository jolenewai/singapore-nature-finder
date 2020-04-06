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

<<<<<<< HEAD
    function getMarkers(n,layer){
=======
>>>>>>> origin/rewrite-functions



    function displaySearchResults(parks, nparks, cyclingPath, trees, pcn, nParksTracks, parkData){
        
        clearMarkers()
<<<<<<< HEAD
=======

>>>>>>> origin/rewrite-functions
        $('#details').empty()
        $('#search-result-header').empty()

        let query = $('#query').val()
<<<<<<< HEAD
        let noOfResults = 0
 
=======
>>>>>>> origin/rewrite-functions

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
<<<<<<< HEAD
    
=======
>>>>>>> origin/rewrite-functions

    function clearMarkers() {
        if (parksLayer) {
            parksLayer.clearLayers()
        }

        if (nParksLayer) {
            nParksLayer.clearLayers()
        }

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

        if (weather2hrLayer) {
            weather2hrLayer.clearLayers()
        }
<<<<<<< HEAD
=======

        if (weather2hrLayer) {
            weather2hrLayer.clearLayers()
        }
        
>>>>>>> origin/rewrite-functions
    }

<<<<<<< HEAD

    function filterValue(obj, key, value) {
        return obj.find(function(v){ return v[key] === value});
      }

=======
        // console.log(parks)
        axios.get(parkDataAPI).then(function(parkData){
            csv().fromString(parkData.data).then(function (pData) {
                parkData = pData
                if (parksLayer) {
                    parksLayer.clearLayers()
                } else {
                    parksLayer = L.markerClusterGroup();
                }
                
                let noOfResults = 0
>>>>>>> origin/rewrite-functions

 
    function viewParks(parks, query, parkData) {

<<<<<<< HEAD
        parksLayer = L.markerClusterGroup();
=======
                    // only show results with Park in the decription
                    if (desc.indexOf(query) >= 0 || desc.indexOf(query) >= 0) {

                        let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup('<i class="fas fa-seedling pr-2"></i> ' + pName)
                        parksLayer.addLayer(marker); 
>>>>>>> origin/rewrite-functions

        let noOfResults = 0

        for (let n of parks.data.features) {
            let desc = n.properties.Description
            let parkDetails
            pName = $(desc).children().children().children().children().eq(14).text()

            // only show results with Park in the decription
            if (desc.indexOf(query) >= 0 || desc.indexOf(query) >= 0) {
                getMarkers(n,layer)

                noOfResults = noOfResults + 1;

                let location = ""

                for (let p of parkData) {

                    if (p['Park Name'].trim().toLowerCase() == pName.trim().toLowerCase()) {
 
                        location = p.Location
                        accessibility = p.Accessibility
                        parkID = p['Park ID'] 
                        
                        parkDetails = `
                            <div class="card border-0">
                                <img src="/images/park_images/${parkID}.jpg" class="card-img-top pb-2" alt="${pName}" width="390" height="225">
                                <h6>Location:</h6>
                                <p>${location}</p>

                                <h6>Accessibility:</h6> 
                                <p>${accessibility}</p>
                            </div>
                            `
                    }

                }
                
                if (location == ''){
                    parkDetails = ""
                }

                let searchResult = `
                        <a href="#${noOfResults}"></a>
                        <h6 class="bluetext"><i class="fas fa-seedling pr-2"></i> ${pName}</h6>
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

    function viewParksArea(nparks) {
<<<<<<< HEAD

        nParksLayer = new L.geoJson(nparks.data, {
=======
        clearMarkers()
        
        nParksLayer = new L.geoJson(nparks, {
>>>>>>> origin/rewrite-functions
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

<<<<<<< HEAD
    $('#btn-search-home').click(function () {
=======
    function switchLayer(){

        query = ""

        if ($('input[name="show-park"]:checked')) {
            let showMode = $('input[name="show-park"]:checked').val()
            
            if (showMode == 'area') {
                getData(nParksAPI, viewParksArea)
            } else if (showMode == 'marker') {
                getData(parksAPI, displaySearchResults)
            }
        }

    }

    function addLayer(){

        clearMarkers()

        if ($('input[name="show-layers"]:checked')) {

            let checkboxes = $('input[name="show-layers"]:checked')

            checkboxes.each(function () {
                let option = $(this).val()

                if (option == 'cycling') {
                    getData(cyclingAPI, viewCyclingPath)
                } else if (option == 'trees') {
                    getData(treesAPI, viewTrees)
                } else if (option == 'pcn') {
                    getData(pcnAPI, viewPCN)
                } else if (option == 'tracks')
                    getData(nParksTracksAPI, viewNParksTracks)
            })

        }


    }

    function getWeather() {
        let date_time = moment().format()
        let date = moment().format('YYYY-MM-DD')
>>>>>>> origin/rewrite-functions

        params = {
            date_time, date
        }

        axios.get(weather24hrAPI, { params }).then(function (response) {
            displayWeather(response.data)
            
        })

    }

    function get2hrWeather(){

        let date_time = moment().format()
        let date = moment().format('YYYY-MM-DD')

        params = {
            date_time, date
        }

        clearMarkers();

        axios.get(weather2hrAPI, { params }).then(function (response) {

            let weather2hr = response.data
            weather2hrLayer = new L.layerGroup()
            console.log(weather2hr)
            for (let i=0; i< weather2hr.area_metadata.length; i++){

                area = weather2hr.area_metadata[i]
                
                let forecast = weather2hr.items[0].forecasts[i].forecast
                                
                switch (forecast){

                    case "Partly Cloudy (Day)":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudyDay} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Cloudy":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudy} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Partly Cloudy (Night)":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudyNight} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Light Showers":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: rainy} ).bindPopup(area.name + '<br>' + forecast )
                    break;
                    
                    case "Showers":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: showers} ).bindPopup(area.name + '<br>' + forecast )
                    break;
                    
                    case "Thundery Showers":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: thunder} ).bindPopup(area.name + '<br>' + forecast )
                    break;
                } 

                
                weather2hrLayer.addLayer(marker)

            }    

            weather2hrLayer.addTo(map)
            map.setView(sgLl, 12)
            
        })
    }


    function displayWeather(weatherData){
        let forecast = weatherData.items[0].general.forecast
            let lowTemp = weatherData.items[0].general.temperature.low
            let highTemp = weatherData.items[0].general.temperature.high

            let aveTemp = Math.floor((lowTemp + highTemp) / 2)

            let weatherText = `
                    <h3 class="bluetext mb-0 mt-2">24 Hours Forecast</h3>
                    
                    <p class="weatherText mt-0 pt-0 pb-0 mb-0">${forecast} </span></p>
                    <p class="pb-0 mb-0">Average Temperature<br/>

                    <div class="tempNumber my-0 py-0">
                    ${aveTemp}<span class="tempDegree"><sup>°C</sup></span>
                    </div>
                    <p class="highlow">
                        <small><sup><i class="fas fa-temperature-low"></i></sup> </small>${lowTemp} / <small><sup><i class="fas fa-temperature-high"></i></sup></small> ${highTemp}
                    </p>
            `

            $('#forecast24hr').empty()
            $('#forecast24hr').append(weatherText)
    }



    //assign function to buttons
    $('#btn-search').click(getData)
    $("input[type='radio'][name='show-park']").change(getData)
    $('#btn-change').click(getData)
    $('#btn-refresh').click(getData)
    $('#btn-forecast').click(get2hrWeather)
    $('#tab-toggle').click(function(){
        $('#myTabContent').slideToggle()

    })
<<<<<<< HEAD
    getWeather()

    


=======

    getWeather();
    $('#btn-forecast').click(get2hrWeather)
>>>>>>> origin/rewrite-functions
})