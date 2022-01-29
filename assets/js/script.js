
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

function showWeather(city) {
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=e14c3208e3e6754ae41625a043fd64c7&units=imperial";

    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data);
            if (searchHistory.includes(data.name)) {


                addHistory(data.name, true);
            }
            else {
                addHistory(data.name, false);
            }
            console.log(data.main.temp)
            var weather = `<br><br>Temp: ${data.main.temp}
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

            var onecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=e14c3208e3e6754ae41625a043fd64c7&units=imperial";

            fetch(onecall)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    console.log(data);
                    document.getElementById("uv").innerHTML = data.current.uvi;
                });

        });
}
searchButton.addEventListener('click', function () {
    var searchinput = document.getElementById("cityinput").value;
    showWeather(searchinput);
});

function addHistory(city, duplicate) {

    var parent = document.getElementsByClassName("historycontainer")[0];
    if (searchHistory.length > 9 && duplicate == false) {
        searchHistory.pop();
        parent.removeChild(parent.lastChild);

    }
    if (duplicate) {
        var index = searchHistory.indexOf(city);
        searchHistory.splice(index, 1);
        console.log(index)

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
function showForecast() {

}
// var searchinput = document.getElementById("cityinput").value;