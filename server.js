var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var db = require('./config/db');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

var PORT = (process.env.PORT || 3000);

app.listen(PORT, function(){
    console.log(`We are live on: ${PORT}`);
});

MongoClient.connect(db.url, function(err, db){

    app.get('/:url', function(req, res){
        0

    });

});
