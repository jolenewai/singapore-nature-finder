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
let parks
let nParks
$(function () {

    function getName() {
        console.log($('.leaflet-popup-content table td'))
    }

    let str = `
    <center><table><tr><th colspan='2' align='center'><em>Attributes</em></th></tr><tr bgcolor="#E3E3F3"> <th>ADDRESSBLOCKHOUSENUMBER</th> <td></td> </tr><tr bgcolor=""> <th>ADDRESSBUILDINGNAME</th> <td></td> </tr><tr bgcolor="#E3E3F3"> <th>ADDRESSTYPE</th> <td></td> </tr><tr bgcolor=""> <th>HYPERLINK</th> <td></td> </tr><tr bgcolor="#E3E3F3"> <th>LANDXADDRESSPOINT</th> <td>25144.2383</td> </tr><tr bgcolor=""> <th>LANDYADDRESSPOINT</th> <td>34327.0469</td> </tr><tr bgcolor="#E3E3F3"> <th>NAME</th> <td>Bougainvillea Park</td> </tr><tr bgcolor=""> <th>PHOTOURL</th> <td></td> </tr><tr bgcolor="#E3E3F3"> <th>ADDRESSPOSTALCODE</th> <td></td> </tr><tr bgcolor=""> <th>DESCRIPTION</th> <td>Junction of Dunearn Road and Watten Drive</td> </tr><tr bgcolor="#E3E3F3"> <th>ADDRESSSTREETNAME</th> <td></td> </tr><tr bgcolor=""> <th>ADDRESSFLOORNUMBER</th> <td></td> </tr><tr bgcolor="#E3E3F3"> <th>INC_CRC</th> <td>CA4851EDE75AEDFE</td> </tr><tr bgcolor=""> <th>FMEL_UPD_D</th> <td>20200218182414</td> </tr><tr bgcolor="#E3E3F3"> <th>ADDRESSUNITNUMBER</th> <td></td> </tr></table></center>
    `
    // str = str.trim()
    // let strHTML = document.createElement('div')
    // strHTML.innerHTML = str

    console.log($(str).children().children().children().children().eq(16).text())

    let promises = [axios.get(parksAPI), axios.get(nParksAPI), axios.get(sgAPI)];
    axios.all(promises).then(axios.spread(function (parks, nparks, sgmap) {
    
    // create the markers for nature
    let parksLayer = L.markerClusterGroup();

    for (let n of parks.data.features) {
        let desc = n.properties.Description
        
        pName = $(desc).children().children().children().children().eq(14).text()
        // only show results with Park in the decription
        if (desc.indexOf("Park") >= 0 && desc.indexOf("nparks") >= 0) {
            let marker = L.marker([n.geometry.coordinates[1], n.geometry.coordinates[0]], { icon: treeIcon }).bindPopup(pName)
            parksLayer.addLayer(marker);
        }
    }

    parksLayer.addTo(map)

    let nParksLayer = L.geoJson(nparks.data, {
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
        fillOpacity: 0.75
    })

    $('.leaflet-marker-icon').click(getName)






}));




})