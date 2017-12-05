var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var db = require('./config/db');
var request = require('request');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

var PORT = (process.env.PORT || 3000);

//listening on port
app.listen(PORT, function(){
    console.log(`We are live on: ${PORT}`);
});


//Connect to the database
MongoClient.connect(db.url, function(err, db){
    if(err){
        return console.log("could not connect to database" + err);
    }

    //Getting url when a url is passed into be shortened
    app.get(('/https://:url$'), function(req, res){
        var urllong = "https://" + req.params.url;
        var shortened = 'localhost:' + PORT + '/' + Math.round(Math.random() * 1000000000000);
        var retobj = {
            url: urllong,
            shortened: shortened,
        };
        db.collection('url').findOne({url: urllong}, {'_id': 0}, function(err, item){
            var data = JSON.stringify(item);
            console.log(data);
            var shortenedurl = null;
            if(item != null)
                shortenedurl = item.shortened;
            if(err)
                res.send({'error': 'an error has occured'});
            if(shortenedurl == null){
                console.log("entry did not exist, inserting new one");
                db.collection('url').insert(retobj, function(data){
                    res.send(retobj);
                });
            }else{
                console.log("entry already existed. Sending back previous data");
                res.send(data);
            }
        });
    });

    app.get('/:shortened', function(req, res){
        var shortened = 'localhost:' + PORT + '/' + req.params.shortened;
        console.log(shortened);
        db.collection('url').findOne({shortened: shortened}, {'_id': 0}, function(err, item){
            if(item != null){
                console.log("url found");
                console.log(item.url);
                res.redirect(item.url);
            }else{
                res.send("No such shortened URL");
            }
        });

    });
    
});


//Number -> Boolean
//Checks if the shortened number exists already. 
function checkDatabaseHasShortened(number){
    MongoClient.connect(db.url, function(err, db){
        if(err)
            return console.log("could not connect to db when checking for existing shortened url");
        //find one that contains our shortened number.
        db.collection('url').findOne({shortened: number}).then(function(item){

            var data = JSON.stringify(item);
            if(data.shortened != null){
                console.log("FOUND A NUMBER THAT MATCHED");
                return true;
            }else{
                console.log("did not find a number that matched");
                return false;
            }
        });
    });
}


//void -> number
//Generates new number for a url
function GenerateNewShortenedNumber(){
    var i=0; 
    while(checkDatabaseHasShortened(i) == true){
        i++;
    }
    console.log("Found an empty one! the number is: " + i);
    return i;
}


//To keep heroku worker alive
var reqTimer = setTimeout(function wakeUp() {
    request("https://unix-date-api.herokuapp.com/", function() {
       console.log("WAKE UP DYNO");
    });
    return reqTimer = setTimeout(wakeUp, 1200000);
 }, 1200000);