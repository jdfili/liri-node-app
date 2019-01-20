require("dotenv").config();
var axios = require('axios');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');
var spotify = new Spotify(keys.spotify);
var omdb = keys.omdb.key;
var bit = keys.BandsInTown.key;

function initialize() {
    var action = process.argv[2];
    var search = process.argv.slice(3).join(" ");
    toDo(action, search);
}

function concertThis(search) {
    if (search === "") {
        search = "Dance Gavin Dance"
        console.log("You didn't specify a band, so check out these dudes >>>>>>>>>>>>")
    }

    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=" + bit)
        .then(
            function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    var info = "Artist: " + search + "\nVenue: " + response.data[i].venue.name + "\nLocation: " + response.data[i].venue.city + ", " +
                        response.data[i].venue.country + "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
                        "\n----------------------------\n";
                    console.log(info);
                    fs.appendFile("log.txt", info, function (err) {
                        if (err) throw err;

                    });
                }
            })
        .catch(function (error) {
            console.log(error);
        });
};

function spotifyThisSong(search) {
    if (search === "") {
        search = "The Sign"
        console.log("You didn't provide a song, so here's this >>>>>>>")
    };
    spotify.search({
        type: 'track',
        query: search
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var response = data.tracks.items;
        var info = "Artist: " + response[0].artists[0].name + "\n" + "Song: " + response[0].name + "\n"
            + "Preview: " + response[0].external_urls.spotify +
            "\n" + "Album: " + response[0].album.name + "\n---------------------\n";
        console.log(info);
        fs.appendFile("log.txt", info, function (err) {
            if (err) throw err;

        });
    });
}

function movieThis(search) {
    if (search === "") {
        search = "Mr. Nobody."
        console.log("You didn't provide a title so here's this >>>>>>>>>>")
    }
    axios.get('http://www.omdbapi.com/?apikey=' + omdb + '&t=' + search)
        .then(function (response) {
            var info = response.data;
            var logInfo = "Title: " + info.Title + "\nYear: " + info.Year + "\nIMDB Rating: " + info.imdbRating +
                "\nRottenTomatoes Rating: " + info.Ratings[1].Value + "\nCountry: " + info.Country + "\nPlot: " + info.Plot +
                "\nActors: " + info.Actors + "\n---------------------------\n"
            console.log(logInfo);
            fs.appendFile("log.txt", logInfo, function (err) {
                if (err) throw err;

            });
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