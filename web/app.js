'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// Create the application
var app = express();
var twilioRoutes = require('./routes/twilioRoutes.js');

// Enable CORS on the app
app.use(cors());

// Parse JSON with body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// choose whatever port we want to listen on
var port = process.env.PORT || 8080;

app.use("/", twilioRoutes);

app.listen(port, function(){
	console.log("Magic happens on port " + port);
})