# URL shortener api

This is a URL Shortener Microservice api based on freecodecamp timestamp-microservice


To run this, first make sure to have the following dependencies:
```
npm install express.js --save
npm install body-parser.js --save
npm install mongodb --save
npm install request --save
```

Then in console, run: 

```
node server.js
```
Example of requests include are: 

```
N/A
```

An existing one is running via heroku: 
Not set up yet

This uses mLab for the mongodb database. Make a new config folder and add your own db.js file with the following code

``` javascript

module.exports = {
  url = "mongodb://<dbuser>:<dbpassword>@ds123722.mlab.com:23722/YourDatabaseName"
};
```
