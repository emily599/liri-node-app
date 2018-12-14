require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var request = require("request");
var moment = require("moment");
var nodeArgs = process.argv;
var artist = "";


if (process.argv[2] === "concert-this") {
    concertThis();
}

else if (process.argv[2] === "spotify-this-song") {
    spotifyThis();
}

else if (process.argv[2] === "movie-this") {
    movieThis();
}

else if (process.argv[2] === "do-what-it-says") {
    var fs = require('fs');
    let filename = "random.txt";
    fs.readFile(filename, 'utf8', function (err, data) {
        if (err) throw err;
        let split = data.split(",");
        split[1] = split[1].replace(/"/g, "");
        console.log(split);
        if (split[0] === "spotify-this-song") {
            callSpotify(split[1]);
        }
        if (split[0] === "concert-this") {
            callConcert(split[1]);
        }
        if (split[0] === "movie-this") {
            callMovie(split[1]);

        }
    });
}

function concertThis() {
    for (let i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            artist = artist + "+" + nodeArgs[i];
        }
        else {
            artist += nodeArgs[i];
        }
    }

    callConcert(artist);
}





function callConcert(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";


    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Name of Venue: " + JSON.parse(body)[0].venue.name);
            console.log("Venue Location: " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region);
            let date = JSON.parse(body)[0].datetime;
            let momentDate = moment(date).format('MM-DD-YYYY');
            console.log("Date of Event: " + momentDate);


        }

    })
}

function spotifyThis() {
    let song = "";
    for (let i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            song = song + " " + nodeArgs[i];
        }
        else {
            song += nodeArgs[i];
        }
    }
    console.log(song);
    callSpotify(song);


}
function callSpotify(song) {
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        else {
            console.log("Song Title: " + song);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Preview link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);

        }

    });
}
function movieThis() {
    let movie = "";
    for (let i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            movie = movie + "+" + nodeArgs[i];
        }
        else {
            movie += nodeArgs[i];
        }
    }
    callMovie(movie);
}
function callMovie(movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDb Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoe Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);

        }

    })
}