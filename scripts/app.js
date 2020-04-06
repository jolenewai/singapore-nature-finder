
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


$(function () {

    function getData(apiURL, callback){
        getApi(apiURL, callback)
    }

    function getApi(apiURL, callback){

        axios.get(apiURL).then(function(response){
            callback(response.data) 
        })

    }

    function getMarkers(n, layer){

        let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup('<i class="fas fa-seedling pr-2"></i> ' + pName)
        layer.addLayer(marker);  
           
    }


    function displaySearchResults(parks){
        
        clearAllMarkers()

        $('#details').empty()
        $('#search-result-header').empty()

        let query = $('#query').val()
        let noOfResults = 0

        //console.log(parks)
        
        viewParks(parks, query)

    }
    
    function clearAllMarkers(){
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
    }

    function clearMarkers() {

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
        
    }
   
    function viewParks(parks, query) {

        console.log(parks)
        axios.get(parkDataAPI).then(function(parkData){
            csv().fromString(parkData.data).then(function (pData) {
                
                parkData = pData

                parksLayer = L.markerClusterGroup();

                let noOfResults = 0

                for (let n of parks.features) {
                    let desc = n.properties.Description
                    let parkDetails
                    
                    pName = $(desc).children().children().children().children().eq(14).text()

                    // only show results with Park in the decription
                    if (desc.indexOf(query) >= 0 || desc.indexOf(query) >= 0) {
                        getMarkers(n, parksLayer) 

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
            })
        })
    }
    

    function viewParksArea(nparks) {
        clearMarkers(nParksLayer)
        
        nParksLayer = new L.geoJson(nparks, {
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

    function viewCyclingPath(cyclingPath) {

        //marking cycling path
        cyclingPathLayer = new L.geoJson(cyclingPath, {
            // filter: (feature, layer) => {
            //     desc = feature.properties.Description.toLowerCase()
            //     return desc.indexOf(query) >= 0
            // },
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

    function viewNParksTracks(nParksTracks) {

        //mark nParksTracks
        nParksTracksLayer = new L.geoJson(nParksTracks, {
            // filter: (feature, layer) => {
            //     desc = feature.properties.Description.toLowerCase()
            //     return desc.indexOf(query) >= 0
            // },
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

    function viewTrees(trees) {

        // marking trees

        treesLayer = L.markerClusterGroup();

        for (let t of trees.features) {
            
            let desc = t.properties.Description
            pName = $(desc).children().children().children().children().eq(10).text()

            let marker = L.marker([t.geometry.coordinates[1], t.geometry.coordinates[0]], { icon: tree2Icon }).bindPopup(pName)
            treesLayer.addLayer(marker);

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
            weight: 2,
            Opacity: 0.5
        })

    }

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

    $('#btn-search-home').click(function () {

        axios.get('/results.html').then(function (response) {
            window.location = '/results.html'
            displayResult()
        })

    })


    //assign function to buttons
    $('#btn-search').click(function(){
        getData(parksAPI, displaySearchResults)
    })
    $("input[name='show-park']").change(switchLayer)

    $('#btn-addlayer').click(addLayer)
    $('#tab-toggle').click(function(){
        $('#myTabContent').slideToggle()

    })

    getWeather()
    $('#btn-forecast').click(get2hrWeather)

    


})