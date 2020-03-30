//foursquare clientid
// let clientId = "IRDBUTDRK0IU2A1O2LWFJPFUTNUSTQFZEOPP5QWVXOQ0LMDM"
// let clientSecret = "XX32BTHUQ3MU5QXPATTSHF4Z3ASR3VPE2W5F2FGZ21Z1B5ZW"

//foursquare api base URL
// let foursquareURL = "https://api.foursquare.com/v2/venues/search"

// let natureCat = "4d4b7105d754a06377d81259"
// let foursquareParam = {
//         client_id: clientId, 
//         client_secret: clientSecret, 
//         near: "Singapore",
//         categoryId: natureCat,
//         v:"20200328"
// }

//Data from data.gov.sg

//markers layer
let parksAPI = "/data/parks-geojson.geojson"
let parksLayer 

//geojson polygon layer
let nParksAPI = "/data/nparks-parks-geojson.geojson"
let nParksLayer


$(function(){
    
    getData(nParksAPI, startLoading)

    function getData(url, startLoading){
        let promise = [axios.get(parksAPI), axios.get(nParksAPI)]

        let data = null
        axios.all(promise).then(axios.spread(function(parks, nparks)){
            
        })
    }    

    function startLoading(loadedData){
        mapMarking(loadedData)
    } 

    function mapMarking(r){
        nParksLayer = L.geoJson(r.data,{
            onEachFeature:(feature, layer) => {
                layer.bindPopup(feature.properties.Description);
            }
        }).addTo(map);

        nParksLayer.setStyle({
            color:'green',
            fill:'green'
        })

    
        
        
    }

    
    
    
    
    
    

})