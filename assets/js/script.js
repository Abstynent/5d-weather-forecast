// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
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
    if(savedCities.includes(city)) { console.log("its there"); return;}
    savedCities.unshift(city);
    localStorage.setItem("cities", JSON.stringify(savedCities));
    var btnEl = $('<button type="button" class="btn btn-secondary m-1"></button>');
    btnEl.text(city);
    historyContainerEl.prepend(btnEl);
};

function renderCityHistoryList() {
    console.log("im in render city");
    for(var i=0; i<savedCities.length; i++){
        var usedCityName = savedCities[i];
        console.log(usedCityName);
        var btnEl = $('<button type="button" class="btn btn-secondary m-1"></button>');
        historyContainerEl.append(btnEl);
        btnEl.text(usedCityName);
    };

};

function handleCitySearch(event) {
    event.preventDefault();
    cityInput = $('input[name="city"').val();
    addCityToLocalStorage(cityInput);
    cityNameSearch[0].reset(); // clear the value

};
console.log("something");
cityNameSearch.on('submit', handleCitySearch);

// check if the city is already in the array