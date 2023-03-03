const APIKey = 'c0b6600a97a11c8918dfc87b9f7842c6';
var cityNameSearch = $('#city-name-search');
var historyContainerEl = $('#search-history');
var historyContainerListEl = $('<ul>');
var savedCities = new Array();
// var btnStyle = $('<button type="button" class="btn btn-secondary m-1"></button>');

$(function() {
    if(JSON.parse(localStorage.getItem("cities") !== null)) savedCities = JSON.parse(localStorage.getItem("cities"));
    renderCityHistoryList();

    console.log(savedCities);
});



function addCityToLocalStorage(city) {
    if(savedCities.includes(city)) return;
    savedCities.unshift(city);
    localStorage.setItem("cities", JSON.stringify(savedCities));
    var btnEl = $('<button type="button" class="btn btn-secondary m-1"></button>');
    btnEl.text(city);
    historyContainerEl.prepend(btnEl);
};

function renderCityHistoryList() {
    for(var i=0; i<savedCities.length; i++){
        var usedCityName = savedCities[i];
        var btnEl = $('<button type="button" class="btn btn-secondary m-1"></button>');
        historyContainerEl.append(btnEl);
        btnEl.text(usedCityName);
    };

};

function showWeather(city) {
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + APIKey;
    var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=' + APIKey;
    fetch(currentWeatherURL).then(function(response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(response);
                console.log(data);
                var todayCityName = $('#today-city-name');
                var todayTemp = $('#today-temp');
                var todayWind = $('#today-wind');
                var todayHum = $('#today-hum');
                var icon = $('<img src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png">')
        
                todayCityName.text(data.name + dayjs().format(" (DD/MM/YYYY)"));
                todayCityName.append(icon);
                todayTemp.text(data.main.temp + " ℃");
                todayWind.text(data.wind.speed + " mph");
                todayHum.text(data.main.humidity + " %");

                addCityToLocalStorage(city);
            });
        } else {
            alert('City does not exist.')
        }
    });
};



function handleCitySearch(event) {
    event.preventDefault();
    city = $('input[name="city"').val();
    showWeather(city);
    cityNameSearch[0].reset(); // clear the value

};
cityNameSearch.on('submit', handleCitySearch);

// do not add wrong cities to the menu
// buttons to work on the weather somehow

// 5day forecast