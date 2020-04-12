let sgLl = [1.3521, 103.8198]
let map = L.map("map-container").setView(sgLl,11)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' //demo access token
}).addTo(map);

L.Map.addInitHook('addHandler', 'tilt', L.TiltHandler);

let treeIcon = L.icon({
    iconUrl: '/images/tree_icon.png',
    iconSize: [16, 30],
    iconAnchor: [8, 30],
    popupAnchor: [-3, -30],
    shadowUrl: '/images/tree_icon_shadow.png',
    shadowSize: [33, 17],
    shadowAnchor: [9, 14]
})

let tree2Icon = L.icon({
    iconUrl: '/images/tree2_icon.png',
    iconSize: [16, 30],
    iconAnchor: [8, 30],
    popupAnchor: [-3, -30],
    shadowUrl: '/images/tree_icon_shadow.png',
    shadowSize: [33, 17],
    shadowAnchor: [9, 14]
})

let sunny = L.icon({
    iconUrl: '/images/icons/sunny.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-3, -40],
   
})

let cloudy = L.icon({
    iconUrl: '/images/icons/cloudy.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-3, -40],
   
})

let cloudyDay = L.icon({
    iconUrl: '/images/icons/cloudy_day.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-3, -40],
   
})

let cloudyNight = L.icon({
    iconUrl: '/images/icons/cloudy_night.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-3, -40],
   
})

let lightRain = L.icon({
    iconUrl: '/images/icons/rainy.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-3, -40],
   
})

let showers = L.icon({
    iconUrl: '/images/icons/showers.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-3, -40],
   
})

let thunder = L.icon({
    iconUrl: '/images/icons/thunder_storm.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [-3, -40],
   
})

