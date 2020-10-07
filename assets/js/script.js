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
                    displayCurrent(data);
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

var displayCurrent = function(city) {
    // clear old conent
    currentWeatherEl.textContent = "";

    // create a container for each current city date
    var currentCityEl = document.createElement("h2");
    var currentDateEl = document.createElement("span");
    var currentIconEl = document.createElement("img");
    var cityName = city.name;
    var currentDay = new Date();
    var month = currentDay.getMonth();
    var day = currentDay.getDate();
    var year = currentDay.getFullYear();
    var date = month + "/" + day + "/" + year;
    var icon = "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png";
    currentIconEl.setAttribute("src", icon);
    
    
    currentCityEl.textContent = cityName;
    currentDateEl.textContent = " (" + date + ")";
    // currentIconEl = icon;
    currentCityEl.appendChild(currentDateEl);
    currentCityEl.appendChild(currentIconEl);
    currentWeatherEl.appendChild(currentCityEl);

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