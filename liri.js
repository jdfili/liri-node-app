require("dotenv").config();
var axios = require('axios');
var keys = require('./keys.js');
var spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');
var spotify = new spotify(keys.spotify);
var omdb = keys.omdb.key;
var bit = keys.BandsInTown.key;
var action = process.argv[2];
var search = process.argv[3];

function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=" + bit).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i].venue.name + " - " + response.data[i].venue.country + " - " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
            }
        }

    );
};

function spotifyThisSong() {

    spotify.search({
        type: 'track',
        query: search
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < 10; i++) {
            var results = data.tracks.items;
            console.log(results[i].artists[0].name);
            console.log(results[i].name);
            console.log(results[i].href);
            console.log(results[i].album.name);
            console.log("___________________________")
        }
    });
}

function movieThis() {
    axios.get('http://www.omdbapi.com/?apikey=' + omdb + '&t=' + search)
        .then(function (response) {
            var info = response.data;
            console.log("Title: " + info.Title);
            console.log("Year: " + info.Year);
            console.log("IMDB Rating: " + info.imdbRating);
            console.log("RottenTomatoes Rating: " + info.Ratings[1].Value);
            console.log("Country: " + info.Country);
            console.log("Language: " + info.Language);
            console.log("Plot: " + info.Plot);
            console.log("Actors: " + info.Actors);

        })
        .catch(function (error) {
            console.log(error);
        });
}

switch (action) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
}