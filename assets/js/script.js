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
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + APIKey;

    fetch(requestUrl).then(function(response) {
        console.log(response);
        if(response.status == 200) {
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
            });
        };
    });
};


// fetch(apiUrl)
// .then(function (response) {
//   if (response.ok) {
//     console.log(response);
//     response.json().then(function (data) {
//       console.log(data);
//       displayRepos(data, user);
//     });
//   } else {
//     alert('Error: ' + response.statusText);
//   }
// })
// .catch(function (error) {
//   alert('Unable to connect to GitHub');
// });
// };


function handleCitySearch(event) {
    event.preventDefault();
    cityInput = $('input[name="city"').val();
    addCityToLocalStorage(cityInput);
    showWeather(cityInput);
    cityNameSearch[0].reset(); // clear the value

};
cityNameSearch.on('submit', handleCitySearch);

// check if the city is already in the array