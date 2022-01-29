// get previous searches
var searchButton = document.getElementById('button');
var searchHistory = [];
if (localStorage.getItem("history")) {
    searchHistory = JSON.parse(localStorage.getItem("history"))
    for (var i = 0; i < searchHistory.length; i++) {
        var el = document.createElement("div");
        el.classList.add("history");
        el.innerText = searchHistory[i];
        el.addEventListener("click", function (event) {
            showWeather(event.target.innerText);
        });
        document.getElementsByClassName("historycontainer")[0].appendChild(el);
    }
    showWeather(searchHistory[0]);
}
// display current weather (not uvi, uvi from onecall api)

function showWeather(city) {
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=e14c3208e3e6754ae41625a043fd64c7&units=imperial";
    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // checks for duplicate searches
            if (searchHistory.includes(data.name)) {
                addHistory(data.name, true);
            }
            else {
                addHistory(data.name, false);
            }
            var weather = `<br>Temp: ${data.main.temp}
            <br>
            <br><br>
            Wind: ${data.wind.speed}
            <br>
            <br><br>
            Humidity: ${data.main.humidity}
            <br>
            <br><br>
            UV Index: <spam id="uv"></spam>
            <br>
            <br>`;
            document.getElementById("citydata").innerHTML = weather;
            // Current Day
            var date = new Date();
            var day = (new Intl.DateTimeFormat('en-US', {
                month: 'numeric',
                day: '2-digit',
                year: 'numeric',
            }).format(date));
            document.getElementById("currentcity").innerHTML = data.name + " (" + day + ")";

            // displays 5 day forcast for api, icons and uvi
            var onecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=e14c3208e3e6754ae41625a043fd64c7&units=imperial";

            fetch(onecall)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    var daily = data.daily;
                    for (var i = 1; i < 6; i++) {
                        // forecast Date
                        var forecastdate = new Date(daily[i].dt * 1000);
                        var forecastday = (new Intl.DateTimeFormat('en-US', {
                            month: 'numeric',
                            day: '2-digit',
                            year: 'numeric',
                        }).format(forecastdate));
                        var forecast = `  <h2>${forecastday}</h2>

                        <img src="http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png"> <br><br>
                        Temp: ${daily[i].temp.day}
                        <br>
                        <br><br>
                        Wind: ${daily[i].wind_speed}
                        <br>
                        <br><br>
                        Humidity: ${daily[i].humidity} 
                        <br>
                        <br><br>`;

                        document.getElementsByClassName("forecastcard")[i - 1].innerHTML = forecast;

                    }
                    document.getElementById("currenticon").src = `http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png`;
                    document.getElementById("uv").innerHTML = data.current.uvi;
                    // change uvi background color based on value
                    if (data.current.uvi < 3) {
                        document.getElementById("uv").style.backgroundColor = "green";

                    }
                    else if (data.current.uvi < 8) {
                        document.getElementById("uv").style.backgroundColor = "gold";
                    }
                    else { document.getElementById("uv").style.backgroundColor = "red"; }
                });

        });
}
//displays weather data when history is clicked 
searchButton.addEventListener('click', function () {
    var searchinput = document.getElementById("cityinput").value;
    showWeather(searchinput);
});

// add the search to the loca histoy max 10 removing duplicates
function addHistory(city, duplicate) {

    var parent = document.getElementsByClassName("historycontainer")[0];
    if (searchHistory.length > 9 && duplicate == false) {
        searchHistory.pop();
        parent.removeChild(parent.lastChild);

    }
    if (duplicate) {
        var index = searchHistory.indexOf(city);
        searchHistory.splice(index, 1);

        parent.removeChild(parent.children[index]);
    }
    searchHistory.unshift(city);
    var el = document.createElement("div");
    el.classList.add("history");
    el.innerText = city;
    el.addEventListener("click", function (event) {

        showWeather(event.target.innerText);
    });
    document.getElementsByClassName("historycontainer")[0].prepend(el);
    localStorage.setItem("history", JSON.stringify(searchHistory));

}

