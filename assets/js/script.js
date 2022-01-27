
var searchButton = document.getElementById('button');
var searchHistory = [];
if (localStorage.getItem("history")) {
    searchHistory = JSON.parse(localStorage.getItem("history"))
    for (var i = 0; i < searchHistory.length; i++) {
        var el = document.createElement("div");
        el.classList.add("history");
        el.innerText = searchHistory[i];
        document.getElementsByClassName("historycontainer")[0].appendChild(el);
    }
}

function getApi() {
    var searchinput = document.getElementById("cityinput").value;
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + searchinput + "&appid=e14c3208e3e6754ae41625a043fd64c7";

    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            console.log(data);
            addHistory(data.name);


        });
}
searchButton.addEventListener('click', getApi);
function addHistory(city) {
    searchHistory.unshift(city);
    var el = document.createElement("div");
    el.classList.add("history");
    el.innerText = city;
    document.getElementsByClassName("historycontainer")[0].prepend(el);
    localStorage.setItem("history", JSON.stringify(searchHistory));

}
