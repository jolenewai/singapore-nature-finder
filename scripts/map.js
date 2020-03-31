let sgLl = [1.3521, 103.8198]
let map = L.map("map-container").setView(sgLl,12)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

let treeIcon = L.icon({
    iconUrl: '../images/tree_icon.png',
    iconSize: [16, 30],
    iconAnchor: [8, 30],
    popupAnchor: [-3, -30],
    shadowUrl: '../images/tree_icon_shadow.png',
    shadowSize: [33, 17],
    shadowAnchor: [9, 14]
})
