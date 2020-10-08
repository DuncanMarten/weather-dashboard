// vars for dom elements
cityFormEl = document.querySelector("#city-form");
citiesListEl = document.querySelector("#previous-container");
cityInputEl = document.querySelector("#city");
currentWeatherEl = document.querySelector("#current-container");
forecastEl = document.querySelector("#forecast-container");


var getCurrentWeather = function(city) {
    // format the current weather openweather api
    var weatherApi = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=18b425dc0d2d222cc6d9672def840d5a&units=imperial";

    // make a request to the url
    fetch(weatherApi)
        .then(function(response) {
            // request was successful
            if(response.ok) {
                response.json().then(function(data) {
                    displayCurrent(data);
                    getUV(data);
                    console.log(data);
                });
            }
        });

};

var getForecast = function(city) {
    // format the forecast openweather api
    var forecastApi = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=18b425dc0d2d222cc6d9672def840d5a";

    // make a request to the url
    fetch(forecastApi)
        .then(function(response) {
            // request was successful
            if(response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                });
            }
        });
};

var getUV = function(city) {
    // pull lat and longitude from current weather fetch
    var lat = city.coord.lat;
    var long = city.coord.lon;
    
    // format the uv openweather api
    var UVApi = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=18b425dc0d2d222cc6d9672def840d5a";

    // make a request to the url
    fetch(UVApi)
        .then(function(response) {
            // request was successful
            if(response.ok) {
                response.json().then(function(data) {
                    // current UV index
                    var UVEl = document.createElement("p");
                    var UV = data.value;
                    UVEl.textContent = "UV Index:  " + UV;
                    //append to current weather container
                    currentWeatherEl.appendChild(UVEl);
                });
            }
        });
};

var displayCurrent = function(city) {
    // clear old conent
    currentWeatherEl.textContent = "";

    // create a container for each current city date
    var currentCityEl = document.createElement("h2");
    var currentDateEl = document.createElement("span");
    var currentIconEl = document.createElement("img");
    
    // get variable of city name
    var cityName = city.name;
    
    // create a date
    var currentDay = new Date();
    var month = currentDay.getMonth();
    var day = currentDay.getDate();
    var year = currentDay.getFullYear();
    var date = month + "/" + day + "/" + year;
    
    // create the weather icon
    var icon = "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png";
    currentIconEl.setAttribute("src", icon);
    
    // current temperature
    var tempEl = document.createElement("p");
    var openTemp = city.main.temp;
    tempEl.textContent = "Temperature:  " + openTemp + " °F"

    // current humidity
    var humidEl = document.createElement("p");
    var humidity = city.main.humidity;
    humidEl.textContent = "Humidity:  " + humidity + " %";

    // current wind speed
    var windEl = document.createElement("p");
    var windSpeed = city.wind.speed;
    windEl.textContent = "Wind Speed:  " + windSpeed + " MPH";

   // set the text content of elements 
    currentCityEl.textContent = cityName;
    currentDateEl.textContent = " (" + date + ") ";
    
    // append elements to currentCityEl
    currentCityEl.appendChild(currentDateEl);
    currentCityEl.appendChild(currentIconEl);
    
    // append elements to container
    currentWeatherEl.appendChild(currentCityEl);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(humidEl);
    currentWeatherEl.appendChild(windEl);

}





var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a City name!");
    }
}

// submit button clicked
cityFormEl.addEventListener("submit", formSubmitHandler);