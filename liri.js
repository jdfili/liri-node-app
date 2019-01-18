require("dotenv").config();
var axios = require('axios');
var keys = require('./keys.js');
var spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');
var spotify = new spotify(keys.spotify);
var omdb = keys.omdb.key;
var bit = keys.BandsInTown.key;

function initialize() {
    var action = process.argv[2];
    var search = process.argv.slice(3).join(" ");
    toDo(action, search);
}

function concertThis(search) {

    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=" + bit)
        .then(
            function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    console.log("Venue: " + response.data[i].venue.name + "\nLocation: " + response.data[i].venue.city + ", " +
                        response.data[i].venue.country + "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
                        "\n----------------------------");
                }
            })
        .catch(function (error) {
            console.log(error);
        });
};

function spotifyThisSong(search) {

    spotify.search({
        type: 'track',
        query: search
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {
            var response = data.tracks.items;
            console.log(response[i].artists[0].name + "\n" + response[i].name + "\n" + response[i].href +
                "\n" + response[i].album.name + "\n---------------------");
        }
    });
}

function movieThis(search) {
    axios.get('http://www.omdbapi.com/?apikey=' + omdb + '&t=' + search)
        .then(function (response) {
            var info = response.data;
            console.log("Title: " + info.Title + "\nYear: " + info.Year + "\nIMDB Rating: " + info.imdbRating +
                "\nRottenTomatoes Rating: " + info.Ratings[1].Value + "\nCountry: " + info.Country + "\nPlot: " + info.Plot +
                "\nActors: " + info.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf-8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",")
        var doAction = dataArr[0];
        var doSearch = dataArr[1];
        toDo(doAction, doSearch);
    })
}

function toDo(action, search) {
    switch (action) {
        case "concert-this":
            concertThis(search);
            break;
        case "spotify-this-song":
            spotifyThisSong(search);
            break;
        case "movie-this":
            movieThis(search);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            {
                console.log("error: invalid request")
            }
    };
};

initialize();