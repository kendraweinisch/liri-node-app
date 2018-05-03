//All the darn requiring
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var fs = require('fs');

var commands = {
    TWITTER: 'my-tweets',
    SPOTIFY: 'spotify-this-song',
    MOVIE: 'movie-this',
    DOWHATITSAYS: 'do-what-it-says'
}

var nodeArgv = process.argv;
var command = process.argv[2];
var x = "";
//check input for multiple words in string
for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        x = x + "+" + nodeArgv[i];
    } else {
        x = x + nodeArgv[i];
    }
}

//start switch argument to determine function to use
switch (command) {
    case "my-tweets":
        showTweets();
        break;

    case "spotify-this-song":
        if (x) {
            spotifySong(x);
        } else {
            spotifySong("I Want It That Way");
        }
        break;

    case "movie-this":
        if (x) {
            omdbData(x)
        } else {
            omdbData("Mr. Nobody")
        }
        break;

    case "do-what-it-says":
        doThing();
        break;

    default:
        console.log("Please enter a command: my-tweets, spotify-this-song, movie-this, or do-what-it-says");
        break;
}

//Function OMDB code
function omdbData(movieSearch) {
    var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + movieSearch;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);

            //adds text to log.txt
            fs.appendFile('log.txt', "Title: " + body.Title);
            fs.appendFile('log.txt', "Release Year: " + body.Year);
            fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
            fs.appendFile('log.txt', "Country: " + body.Country);
            fs.appendFile('log.txt', "Language: " + body.Language);
            fs.appendFile('log.txt', "Plot: " + body.Plot);
            fs.appendFile('log.txt', "Actors: " + body.Actors);
            fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);

        } else {
            console.log('Error occurred.')
        }
        if (movieSearch === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");

            //adds text to log.txt
            fs.appendFile('log.txt', "-----------------------");
            fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            fs.appendFile('log.txt', "It's on Netflix!");
        }
    });
}

//Function Twitter Code
function showTweets() {
    var twitter = new Twitter(keys.twitter);
    twitter.get("statuses/user_timeline", function (error, tweets, response) {
        if (error) {
            console.log(error)
        }
        else {
            tweets.map(function (tweet) {
                console.log(tweet.text)
            })
        }
    });
}

//Function Spotify Code
function spotifySong(song){
    spotify.search({ type: 'track', query: song}, function(error, data){
      if(!error){
        for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
          
          //adds text to log.txt
          fs.appendFile('log.txt', songData.artists[0].name);
          fs.appendFile('log.txt', songData.name);
          fs.appendFile('log.txt', songData.preview_url);
          fs.appendFile('log.txt', songData.album.name);
          fs.appendFile('log.txt', "-----------------------");
        }
      } else{
        console.log('Error occurred.');
      }
    });
  }
//Function doThing Code
function doThing() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var txt = data.split(',');
        spotifySong(txt[1]);
    });
}