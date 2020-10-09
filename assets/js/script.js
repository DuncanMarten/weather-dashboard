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
                });
            } else {
                alert("Please enter a new city!");
            }
        }).catch(function(error) {
            alert("Unable to connect to OpenWeather");
        })

};

var getForecast = function(city) {
    // format the forecast openweather api
    var forecastApi = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=18b425dc0d2d222cc6d9672def840d5a&units=imperial";

    // make a request to the url
    fetch(forecastApi)
        .then(function(response) {
            // request was successful
            if(response.ok) {
                response.json().then(function(data) {
                    displayForecast(data);
                    
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

                    if (UV < 3){
                        UVEl.innerHTML = "UV Index:  " + "<span class='bg-success text-white p-1'>" + UV + "</span>";
                    }
                    else if (UV > 3 && UV < 7) {
                        UVEl.innerHTML = "UV Index:  " + "<span class='bg-warning p-1'>" + UV + "</span>";
                    }
                    else {
                        UVEl.innerHTML = "UV Index:  " + "<span class='bg-danger text-white p-1'>" + UV + "</span>";
                    }
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
    var openTemp = Math.round(city.main.temp * 10) / 10;
    tempEl.textContent = "Temperature:  " + openTemp + " °F"

    // current humidity
    var humidEl = document.createElement("p");
    var humidity = city.main.humidity;
    humidEl.textContent = "Humidity:  " + humidity + "%";

    // current wind speed
    var windEl = document.createElement("p");
    var windSpeed = Math.round(city.wind.speed * 10) / 10;
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

var displayForecast = function(city) {
    // set title of forecast
    var titleEl = document.querySelector("#forecastTitle");
    titleEl.removeAttribute("class", "d-none");
    titleEl.setAttribute("class", "d-block")

    // remove old content
    forecastEl.textContent = "";

    // loop over array to create 5 day forecast
    for (i = 0; i < city.list.length; i += 8){
        // created elements for forecast
        var dayForecast = document.createElement("div");
        dayForecast.setAttribute("class", "col-md-2 bg-primary text-white ml-md-2")
        var date = document.createElement("h5");
        var iconEl = document.createElement("img");
        var tempEl = document.createElement("p");
        var humidEl = document.createElement("p");

        // list item variable
        var dayDate = city.list[i];

        // create date for each list item
        var dateText = dayDate.dt_txt.split(" ")[0];
        var dateParts = dateText.split("-");
        date.textContent = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0];
        
        // create the weather icon
        var icon = "http://openweathermap.org/img/wn/" + dayDate.weather[0].icon + "@2x.png";
        iconEl.setAttribute("src", icon);
        
        // create the temperature text
        var temp = Math.round(dayDate.main.temp * 10) / 10;
        tempEl.textContent = "Temp:  " + temp  + " °F";

        // create the humidity text
        var humid = dayDate.main.humidity;
        humidEl.textContent = "Humidity:  " + humid + "%";

        // append elements to container
        dayForecast.appendChild(date);
        dayForecast.appendChild(iconEl);
        dayForecast.appendChild(tempEl);
        dayForecast.appendChild(humidEl);
        
        // append each day element to container
        forecastEl.appendChild(dayForecast);
    }
};


// Array for cities 
var cities = [];

// save previous searched cities
var saveCity = function(){
    localStorage.setItem("city", JSON.stringify(cities))
}

// display cities stored as buttons
var createCityButtons = function() {
    // pull and parse localStorage
    cities = JSON.parse(localStorage.getItem("city"));

    // clear button container
    citiesListEl.innerHTML = "";

    if (!cities) {
        cities = [];
    }

    // loop through eash city array item
    for (i = 0; i < cities.length; i++) {
        // create button
        var cityButtonEl = document.createElement("button");
        cityButtonEl.setAttribute("value", cities[i]);
        cityButtonEl.setAttribute("class", "btn btn-secondary mt-1 ml-2")
            
        // find and set city item to button element
        var citySelect = cities[i];
        cityButtonEl.textContent = citySelect;

        // append button to container
        citiesListEl.appendChild(cityButtonEl);
    }
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if (cities.includes(city) === false) {
        cities.push(city);
    }

    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        cityInputEl.value = "";
        saveCity();
        createCityButtons();
    } else {
        alert("Please enter a City name!");
    }
}

var buttonClickHandler = function(event) {
    event.preventDefault();

    // get value of city from button
    var citySelected = event.target.value;

    // push selected city into fetches
    getCurrentWeather(citySelected);
    getForecast(citySelected);
}

createCityButtons();

// submit button clicked
cityFormEl.addEventListener("submit", formSubmitHandler);
citiesListEl.addEventListener("click", buttonClickHandler);