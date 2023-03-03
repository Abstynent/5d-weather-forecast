const APIKey = 'c0b6600a97a11c8918dfc87b9f7842c6';
var cityNameSearch = $('#city-name-search');
var historyContainerEl = $('#search-history');
var historyContainerListEl = $('<ul>');
var savedCities = new Array();
var timeNow = dayjs().format("DD/MM/YYYY");
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
    btnEl.attr("data-city", city).text(city);
    historyContainerEl.prepend(btnEl);
};

function renderCityHistoryList() {
    for(var i=0; i<savedCities.length; i++){
        var city = savedCities[i];
        var btnEl = $('<button type="button" class="btn btn-secondary m-1"></button>');
        btnEl.attr("data-city", city).text(city);
        historyContainerEl.append(btnEl);
    };

};

function showWeather(city) {
    var currentWeatherURL = 
        'https://api.openweathermap.org/data/2.5/weather?q=' 
        + city + '&units=metric&appid=' + APIKey;
    var forecastURL = 
        'http://api.openweathermap.org/data/2.5/forecast?q=' 
        + city + '&units=metric&appid=' + APIKey;

    fetch(currentWeatherURL).then(function(response) {
        if(response.ok) {
            response.json().then(function (data) {
                console.log(response);
                console.log(data);
                addCityToLocalStorage(city);
                var icon = $('<img src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png">')

                $('#today-city-name').text(data.name + " (" + timeNow + ")").append(icon);
                $('#today-temp').text(data.main.temp + " ℃");
                $('#today-wind').text(data.wind.speed + " mph");
                $('#today-hum').text(data.main.humidity + " %");

                fetch(forecastURL).then(function(response) {
                    response.json().then(function(data) {
                        console.log('---------------------');
                        console.log(data);
                        console.log(data.list[0].dt_txt);
                        // this is how to get date and hour from index i in for loop, think how to prepare the last one
                    });
                });

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

// 
// buttons to work on the weather somehow
// data atr set data-city to store city names in button element, i think i can use it for later

// 5day forecast