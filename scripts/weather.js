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

    console.log(date_time)

    axios.get(weather2hrAPI, { params }).then(function (response) {

        let weather2hr = response.data
        weather2hrLayer = new L.layerGroup()
        console.log(weather2hr)

        let weatherIcons =
            [
                { 
                    weather: "Partly Cloudy (Day)",
                    icon: "1"
                },    
                {
                    weather: "Partly Cloudy (Night)",
                    icon:"cloudyNight"
                } ,              
            
                { 
                    weather: "Light Rain",
                    icon: "rainy"
                }              
            ]

        for (let i=0; i< weather2hr.area_metadata.length; i++){

            area = weather2hr.area_metadata[i]
            
            let forecast = weather2hr.items[0].forecasts[i].forecast
                            
            switch (forecast){

                case "Partly Cloudy (Day)":
                    marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudyDay} ).bindPopup(area.name + '<br>' + forecast )
                break;

                case "Partly Cloudy (Night)":
                    marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: cloudyNight} ).bindPopup(area.name + '<br>' + forecast )
                break;

                case "Light Rain":
                    marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: rainy} ).bindPopup(area.name + '<br>' + forecast )
                break;
                
                case ("Showers" || "Thunder Storm"):
                    marker = L.marker([area.label_location.latitude, area.label_location.longitude],{icon: showers} ).bindPopup(area.name + '<br>' + forecast )
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
