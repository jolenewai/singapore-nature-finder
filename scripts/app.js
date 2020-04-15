$(function () {

    function getData(apiURL, callback){
        getApi(apiURL, callback)
    }

    function getApi(apiURL, callback){

        axios.get(apiURL).then(function(response){
            callback(response.data) 
        })

    }
    
    function displaySearchResults(parks){
        clearAllLayers()
        resetSearch()
        viewParks(parks, query)
        searchParks(parks, query, queryText)

    }

    function clearBaseLayer(){
        if (parksLayer) {
            parksLayer.clearLayers()
        }

        if (nParksLayer) {
            nParksLayer.clearLayers()
        }
    }

    function clearOptionalLayers() {

        if (treesLayer) {
            treesLayer.clearLayers()
        }

        if (pcnLayer) {
            pcnLayer.clearLayers()
        }

        if (cyclingPathLayer) {
            cyclingPathLayer.clearLayers()
        }

        if (nParksTracksLayer) {
            nParksTracksLayer.clearLayers()
        }

        if (weather2hrLayer) {
            weather2hrLayer.clearLayers()
        }
        
    }

    function clearAllLayers(){
        clearBaseLayer()
        clearOptionalLayers() 
    }

    function resetSearch(){
        $('#details').empty()
        $('#search-result-header').empty()

    }

    function resetMapView(){
        map.setView(sgLl,12)

    }

    function searchParks(parks, query, queryText){

        axios.get(parkDataAPI).then(function(parkData){
            csv().fromString(parkData.data).then(function (pData) {
                parkData = pData

                let noOfResults = 0
                popUpLatLng = []

                for (let n of parks.features) {
                    let desc = n.properties.Description
                    let parkDetails
                    
                    pName = $(desc).children().children().children().children().eq(14).text()

                    // only show results with Park in the decription
                    if (desc.toLowerCase().indexOf(query) >= 0) {
                        
                        
                        let popup = L.popup({
                            offset: [0, -30]
                        })
                            .setLatLng([n.geometry.coordinates[1], n.geometry.coordinates[0]])
                            .setContent('<i class="fas fa-seedling pr-2"></i> '+pName)
                            
                           
                        popUpLatLng.push(popup)

                        if (query != "" ){
                            noOfResults = noOfResults + 1;

                            let location = ""

                            for (let p of parkData) {

                                if (p['Park Name'].trim().toLowerCase() == pName.trim().toLowerCase()) {
            
                                    location = p.Location
                                    accessibility = p.Accessibility
                                    parkID = p['Park ID'] 
                                    
                                    parkDetails = `
                                        <div class="card border-0">
                                            <img src="images/park_images/${parkID}.jpg" class="card-img-top pb-2" alt="${pName}" width="390" height="225">
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
                                    
                                    <h6 class="bluetext"><i class="fas fa-seedling pr-2"></i> <a id="#${noOfResults}" class="result_title" href="#">${pName}</a></h6>
                                    ${parkDetails}
                                    <hr />
                                `    
                            $('#details').append(searchResult)

                        }
                    }
                }

                let searchResultStr = `
                        <p class="p-3"> ${noOfResults} Search Results for <strong>${queryText}</strong></p>
                        
                    `
                $('#search-result-header').append(searchResultStr)
                
                $.each($('a.result_title'), function(index, value) {
                        $(this).click(function(){
                        map.openPopup(popUpLatLng[index]).flyTo(popUpLatLng[index].getLatLng(),16)
                    })
                });
            })
        })

    }
   
    function viewParks(parks, query) {
                
                parksLayer = L.markerClusterGroup();
                
                for (let n of parks.features) {
                    let desc = n.properties.Description
                    
                    pName = $(desc).children().children().children().children().eq(14).text()

                    // only show results with Park in the decription
                    if (desc.toLowerCase().indexOf(query) >= 0) {
                        let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup('<i class="fas fa-seedling pr-2"></i> ' + pName)
                        parksLayer.addLayer(marker); 

                        $(marker).click(function(){
                            map.flyTo([n.geometry.coordinates[1], n.geometry.coordinates[0]],16)

                        })

                    }
                }
                
                parksLayer.addTo(map)
                map.setView(sgLl,12)
    }
    

    function viewParksArea(nparks) {
        console.log(nparks)

        clearBaseLayer()
        
        nParksLayer = new L.geoJson(nparks, {
            filter: (feature, layer) => {
                desc = feature.properties.Description.toLowerCase()
                return desc.indexOf(query) >= 0
            },
             onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                pName = $(desc).children().children().children().children().eq(4).text()
                layer.bindPopup('<i class="fas fa-seedling pr-2"></i> ' + pName);
            }

        }).addTo(map);

        nParksLayer.setStyle({
            color: '#99A139',
            fillColor: '#476220',
            weight: 1,
            fillOpacity: 0.6
        })
    }

    function viewCyclingPath(cyclingPath) {

        //marking cycling path
        cyclingPathLayer = new L.geoJson(cyclingPath, {
            
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                pName = $(desc).children().children().children().children().eq(2).text()
                layer.bindPopup(pName);
            }
        }).addTo(map)

        cyclingPathLayer.setStyle({
            color: '#563B28',
            weight: 5,
            Opacity: 0.2
        })
    }

    function viewNParksTracks(nParksTracks) {
        //mark nParksTracks
        nParksTracksLayer = new L.geoJson(nParksTracks, {
            
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                //console.log($(desc).children().children().children().children())
                pName = $(desc).children().children().children().children().eq(2).text()
                layer.bindPopup(pName);
            }
        }).addTo(map)

        nParksTracksLayer.setStyle({
            color: '#196C00',
            weight: 3,
            Opacity: 0.5
        })

    }

    function viewTrees(trees) {

        // marking trees

        treesLayer = L.markerClusterGroup();

        for (let t of trees.features) {
            
            let desc = t.properties.Description
            pName = $(desc).children().children().children().children().eq(10).text()
            let marker = L.marker([t.geometry.coordinates[1], t.geometry.coordinates[0]], { icon: tree2Icon }).bindPopup(pName)
            treesLayer.addLayer(marker);

            $(marker).click(function(){
                map.flyTo([n.geometry.coordinates[1], n.geometry.coordinates[0]],16)

            })
        }

        treesLayer.addTo(map)
    }

    function viewPCN(pcn) {

        //mark park connector
        pcnLayer = new L.geoJson(pcn, {
            
            onEachFeature: (feature, layer) => {
                desc = feature.properties.Description
                pName = 'Point A: ' + $(desc).children().children().children().children().eq(2).text()
                pName = pName + '<br/>Point B: ' + $(desc).children().children().children().children().eq(4).text()
                layer.bindPopup(pName);
            }
        }).addTo(map)

        pcnLayer.setStyle({
            color: '#D49683',
            weight: 5,
            Opacity: 0.5
        })

    }

    function switchLayer(){

        // query = ""

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

        clearOptionalLayers()
        query = "" 
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

        clearOptionalLayers();

        axios.get(weather2hrAPI, { params }).then(function (response) {

            let weather2hr = response.data
            weather2hrLayer = new L.layerGroup()
            console.log(weather2hr)

            for (let i=0; i< weather2hr.area_metadata.length; i++){

                area = weather2hr.area_metadata[i]
                
                let forecast = weather2hr.items[0].forecasts[i].forecast
                                
                switch (forecast){

                    case "Cloudy":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudy} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Fair & Warm":
                    case "Fair (Day)":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: sunny} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Partly Cloudy (Day)":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudyDay} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Partly Cloudy (Night)":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudyNight} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Fair (Night)":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: moon} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Light Showers":
                    case "Light Rain":
                    case "Moderate Rain":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: lightRain} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    case "Showers":
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: showers} ).bindPopup(area.name + '<br>' + forecast )
                    break;
                    
                    case "Thundery Showers":
                    case "Heavy Thundery Showers":    
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: thunder} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                    default:
                        marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudy} ).bindPopup(area.name + '<br>' + forecast )
                    break;

                } 

                weather2hrLayer.addLayer(marker)
                console.log([area.label_location.latitude, area.label_location.longitude])
                $(marker).click(function(){
                    map.flyTo(this.getLatLng(),14)
                })
                
            }    
            weather2hrLayer.addTo(map)
            resetMapView()            
        })
    }

    function displayWeather(weatherData){
        console.log(weatherData)
        let forecast = weatherData.items[0].general.forecast
            let lowTemp = weatherData.items[0].general.temperature.low
            let highTemp = weatherData.items[0].general.temperature.high

            let aveTemp = Math.floor((lowTemp + highTemp) / 2)

            switch (forecast){

                case "Fair & Warm":
                case "Fair (Day)":
                    iconURL = "images/icons/sunny.png"
                break;

                case "Partly Cloudy (Day)":
                    iconURL = "images/icons/cloudy_day.png"
                break;

                case "Cloudy":
                    iconURL = "images/icons/cloudy.png"
                break;

                case "Partly Cloudy (Night)":
                    iconURL = "images/icons/cloudy_night.png"
                break;

                case "Light Showers":
                case "Light Rain":
                case "Moderate Rain":
                    iconURL = "images/icons/rainy.png"
                break;
                
                case "Showers":
                    iconURL = "images/icons/showers.png"
                break;
                
                case "Thundery Showers":
                case "Heavy Thundery Showers":    
                    iconURL = "images/icons/thunder_storm.png"
                break;

                default:
                    iconURL = "images/icons/cloudy.png"
                break;

            } 

            let weatherText = `
                    <h3 class="bluetext mb-0 mt-3">24 Hours Forecast</h3>
                    
                        <p class="weatherText mt-0 pt-0 pb-0 mb-0">${forecast} </span></p>
                        <img src="${iconURL}" class="ml-2 pt-2"> 

                        <p class="highlow mt-3">
                            <small class="lightgreen-text"><sup><i class="fas fa-temperature-low"></i></sup> </small>${lowTemp} / <small class="text-danger"><sup><i class="fas fa-temperature-high"></i></sup></small> ${highTemp}
                        </p>
            `

            $('#forecast24hr').empty()
            $('#forecast24hr').append(weatherText)
    }

    //assign function to buttons
    
    getWeather();
    $('#query-home').focus()

      $('#query-home').keyup(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#btn-search-home').click()
        }
      })

    $('#btn-search-home').click(function(){
        $('#home').hide()
        $('#logo').show()
        $('#info-tab').show()
        $('#map-container').show()
        queryTextHome = $('#query-home').val()
        query = queryTextHome.toLowerCase()
        queryText = queryTextHome
        getData(parksAPI, displaySearchResults)
    })

    $('#btn-search').click(function(){
        queryText = $('#query').val()
        query = queryText.toLowerCase()
        getData(parksAPI, displaySearchResults)
    })

    $('#query').keyup(function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $('#btn-search').click()
        }
      })

    $("input[name='show-park']").change(switchLayer)
    $("input[name='show-park']").click(switchLayer)
    $("input[name='show-layers']").click(addLayer)
  
    $('#tab-toggle').click(function(){
        $('#myTabContent').slideToggle()
        $('#tab-toggle i').toggleClass('fa-rotate-180')
    })

    $('#btn-forecast').click(get2hrWeather)

    $('#logo').hide()
    $('#info-tab').hide()
    $('#map-container').hide()

    $('#btn-reset').click(function(){
        resetSearch()
        clearAllLayers()
        resetMapView()
        $("input[name='show-park']").prop('checked', false)
        $("input[name='show-layers']").prop('checked', false)
        query = ''
    })


})