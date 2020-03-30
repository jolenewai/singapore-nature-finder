//foursquare clientid
let clientId = "IRDBUTDRK0IU2A1O2LWFJPFUTNUSTQFZEOPP5QWVXOQ0LMDM"
let clientSecret = "XX32BTHUQ3MU5QXPATTSHF4Z3ASR3VPE2W5F2FGZ21Z1B5ZW"

//foursquare api base URL
let foursquareURL = "https://api.foursquare.com/v2/venues/search"

let natureCat = "4d4b7105d754a06377d81259"
let foursquareParam = {
        client_id: clientId, 
        client_secret: clientSecret, 
        near: "Singapore",
        categoryId: natureCat,
        v:"20200328"
}

let foursquareData = null

$(function(){
    
    getData(foursquareURL,foursquareParam,startLoading)

    function getData(url, param, startLoading){
        let data = null
        axios.get(url, {params:param}).then(response => startLoading(response))
    }    

    function startLoading(loadedData){
        foursquareData = loadedData.data
        mapMarking()
        console.log(loadedData.data)
    }
    

    function mapMarking(){
        let natureGroup = L.layerGroup();
        for (let f of foursquareData.response.venues){
            let marker = L.marker([f.location.lat, f.location.lng],{icon: treeIcon}).bindPopup(f.name)
                
            natureGroup.addLayer(marker)
        }
        map.addLayer(natureGroup)
    }
    
    
    
    

})