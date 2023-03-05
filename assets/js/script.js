const APIKey = 'c0b6600a97a11c8918dfc87b9f7842c6';
var cityNameSearch = $('#city-name-search');
var historyContainerEl = $('#search-history');
var savedCities = new Array();

// func at start of the app
$(function() {
    if(JSON.parse(localStorage.getItem("cities") !== null)) savedCities = JSON.parse(localStorage.getItem("cities"));
    renderCityHistoryList();
});

// fetch data from localstorage and populate list of search history
function renderCityHistoryList() {
    historyContainerEl.empty();
    for(var i=0; i<savedCities.length; i++){
        var city = savedCities[i];
        var btnEl = $('<button type="button" data-city="' + city + '" class="btn btn-secondary m-1"></button>');
        btnEl.attr("data-city", city).text(city);
        historyContainerEl.append(btnEl);
    };

};

// add city to search history as a button, add city to localstorage
function addCityToLocalStorage(city) {
    if(savedCities.includes(city)) return;
    savedCities.unshift(city);
    localStorage.setItem("cities", JSON.stringify(savedCities));
    var btnEl = $('<button type="button" class="btn btn-secondary m-1"></button>');
    btnEl.attr("data-city", city).text(city);
    historyContainerEl.prepend(btnEl);
};



// --------- MAIN FUNCTION
function showWeather(city) {
    // connect to current weather API
    var currentWeatherURL = 
        'https://api.openweathermap.org/data/2.5/weather?q=' 
        + city + '&units=metric&appid=' + APIKey;
    
    // Connect to 5 days every 3 hours API
    var forecastURL = 
        'http://api.openweathermap.org/data/2.5/forecast?q=' 
        + city + '&units=metric&appid=' + APIKey;

    fetch(currentWeatherURL).then(function(response) {
        if(response.ok) { // if city exists (== connection success)
            response.json().then(function (data) {
                addCityToLocalStorage(city);
                renderCurrentWeather(data);
                clearForecastEl(); // clear div

                fetch(forecastURL).then(function(response) {
                    response.json().then(function(data) {
                        renderForecast(data);
                    });
                });
            });
        } else {
            alert('City does not exist.')
        };
    });
};

function renderCurrentWeather(data) {
    var icon = $('<img src="http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png">')

    $('#today-city-name').text(data.name + " (" + dayjs().format("YYYY-MM-DD") + ")").append(icon);
    $('#today-temp').text(data.main.temp + " ℃");
    $('#today-wind').text(data.wind.speed + " mph");
    $('#today-hum').text(data.main.humidity + " %");
};
// if user is checking it before 12am it will display forecast for today as well
function renderForecast(data) {
    for(var i=0; i<40; i++) {
        if(parseInt(data.list[i].dt_txt.split(' ')[1].split(':')[0]) === 12) {
            // console.log(data);
            // console.log(data.list[i].dt_txt.split(' ')[1]);
            var cardEl = $('<div class="bg-secondary p-2 m-2 flex-fill">');
            var date = $('<p>').text(data.list[i].dt_txt.split(' ')[0]);
            var icon = $('<p>').append('<img src="http://openweathermap.org/img/wn/' + data.list[i].weather[0].icon + '.png">');
            var temp = $('<p>').text('Temp: ' + data.list[i].main.temp + " ℃");
            var wind = $('<p>').text('Wind: ' + data.list[i].wind.speed + ' mph');
            var hum = $('<p>').text('Humidity: ' + data.list[i].main.humidity + " %");

            $('#forecast').append(cardEl);
            cardEl.append(date).append(icon).append(temp).append(wind).append(hum); 
        };         
    };
};

// clear forecast section
function clearForecastEl() {
    const parent = $('#forecast');
    parent.empty();
};

// button handlers
cityNameSearch.on('submit', handleCitySearch);

historyContainerEl.click(function(event) {
    var temp = $(event.target);
    let city = temp.data('city');
    savedCities.unshift(savedCities.splice(savedCities.indexOf(city),1)[0]); // ?
    localStorage.setItem("cities", JSON.stringify(savedCities));
    renderCityHistoryList();
    showWeather(city);
});

function handleCitySearch(event) {
    event.preventDefault();
    city = $('input[name="city"').val();
    showWeather(city);
    cityNameSearch[0].reset(); // clear the value
};