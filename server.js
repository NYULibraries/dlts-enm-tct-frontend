var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var logger         = require('morgan');

var port = process.env.PORT || 9000; // set our port


var staticdir = process.env.NODE_ENV === 'production' ? process.env.NODE_DIR + 'dist.prod' : process.env.NODE_DIR + 'dist.dev'; // get static files dir


// get all data/stuff of the body (POST) parameters
// // parse application/json
//app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(logger('dev'));

//app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded


app.use(bodyParser.json());
app.use(methodOverride()); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/' + staticdir)); // set the static files location /public/img will be /img for users
// routes ==================================================
//require('./devServer/routes')(app); // configure our routes
app.get('/*', function(req, res) { 
  res.sendFile(__dirname + '/' + staticdir + '/index.html')
});

// start app ===============================================
app.listen(port);                   // startup our app at http://localhost:8080
console.log('Starting sever on port ' + port);       // shoutout to the user
exports = module.exports = app;             // expose app
