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

    if(err){
        return console.log("could not connect to database" + err);
    }
    app.get(('/https://:url$'), function(req, res){
        var urllong = req.params.url;
        console.log(encodeURI(urllong));
        console.log(urllong);
        console.log(encodeURIComponent(urllong));
        var retobj = {
            url: urllong,
            shortened: encodeURI(urllong),
        };
        db.collection('url').findOne({url: urllong}, function(err, item){
            var data = JSON.stringify(item);
            
            if(err)
                res.send({'error': 'an error has occured'});
            if(data.shortened != null && urllong == data.shortened){
                console.log('data entry exists and shortened url was accessed');
                res.redirect(data.url);
            }else{
                if(data.shortened == null){
                    console.log("entry did not exist, inserting new one");
                    db.collection('url').insert(retobj, function(data){
                        res.send(retobj);
                    });
                }else{
                    console.log("entry already existed. Sending back previous data");
                    res.send(data);
                }
            }
        });
        
    });
});
