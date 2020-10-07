// vars for dom elements
cityFormEl = document.querySelector("#city-form");
citiesListEl = document.querySelector("#previous-container");
cityInputEl = document.querySelector("#city");
currentWeatherEl = document.querySelector("#current-container");
forecastEl = document.querySelector("#forecast-container");


var getCurrentWeather = function(city) {
    // format the current weather openweather api
    var weatherApi = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=18b425dc0d2d222cc6d9672def840d5a";

    // make a request to the url
    fetch(weatherApi)
        .then(function(response) {
            // request was successful
            if(response.ok) {
                response.json().then(function(data) {
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