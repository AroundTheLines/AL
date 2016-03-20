'use strict';

var express = require('express');
var _ = require('lodash');
var request = require('request');
var twilio = require('twilio');
var rp = require('request-promise');

// Twilio Credentials
var accountSid = process.env.ACCOUNT_SID || 'ACf14e3ba903d05bddc9ca4c69e8be6d8d';
var authToken = process.env.AUTH_TOKEN || 'c6bdf749be21593d2073d7bd505ce705';
var FROM_NUMBER = '+12267792228';

// Create a Twilio REST API client for authenticated requests to Twilio
var client = twilio(accountSid, authToken);

var router = express.Router();

var numConnections = 0;
var macAddresses = [];
var whitelisted = "02:1a:11:f9:95:cd";
var location = {};

//Send an SMS text message
var textNumber = function(toNumber, message){
	return new Promise(function(resolve, reject) {
		if(!toNumber){
			toNumber = "+12269205181";
		}
		client.sendMessage({

		    to: toNumber, // Any number Twilio can deliver to
		    from: FROM_NUMBER, // A number you bought from Twilio and can use for outbound communication
		    body: message // body of the SMS message

		}, function(err, responseData) { //this function is executed when a response is received from Twilio

			if(err) {
				reject(err);
			} else { // "err" is an error received during the request, if any

		        console.log(responseData.from); // outputs the "from" number
		        console.log(responseData.body); // outputs the message variable
		        resolve(true);
		    }
		});
	});
};

// Call a number
var callNumber = function(toNumber){
	return new Promise(function(resolve, reject){
		var urls = 'http://22ab2fae.ngrok.io/call_voice';
		//Place a phone call, and respond with TwiML instructions from the given URL
		client.makeCall({

		    to: toNumber, // Any number Twilio can call
		    from: FROM_NUMBER, // A number you bought from Twilio and can use for outbound communication
		    url: urls // A URL that produces an XML document (TwiML) which contains instructions for the call

		}, function(err, responseData) {
			if(err) {
				console.log(err);
				reject(err);
			}
		    //executed when the call has been initiated.
		    console.log("callNumber responseData: " + responseData.from); // outputs "+14506667788"
		});
	});
};

var getLocation = function(macAddress){
	return {
		method: 'POST',
		uri: 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBIJxVeb8GOebSNEEC_pjOUKEKaYhPVvus',
		body: {
			"wifiAccessPoints": macAddress
		},
		json: true
	}
};

// Customize the call response message
router.post('/call_voice', function(req, res){
	var resp = new twilio.TwimlResponse();

	resp.say('Your patient is roaming. Please check their location from your text messages.', {
    	voice:'alice',
    	language:'en-us'
	});

	console.log("call_voice response: " + resp.toString());
	res.type('text/xml');
	res.send(resp.toString());
});

router.get('/alert_helper', function(req, res){
	//console.log(req.headers);
	console.log("Request Query Parameters: ");
	console.log(JSON.stringify(req.query));
	console.log("---");

	macAddresses.push({"macAddress": req.query.mac, "signalStrength": parseInt(req.query.signal.substring(6))});
	console.log(macAddresses);
	res.send('processed');
});

router.get('/number_connections', function(req, res){
	console.log("number_connections: ");
	console.log(req.query);
	numConnections = parseInt(req.query.connections);
	macAddresses = [];
	res.send("processed.");
});

// router.get('/whitelisted_mac', function(req, res){
// 	whitelisted = req.query.whitelist;
// 	console.log(req.query);
// 	res.send('mac address now whitelisted');
// });

setInterval(function(){
	console.log("It's been one minute!");
	if(!macAddresses.length){
		console.log("mac addresses empty");
	}else{
		console.log("mac addresses not empty");
		rp(getLocation(macAddresses)).then(function(res){
			textNumber(( process.env.CARETAKER_PHONE || "+14167990397"), "Your patient is roaming! Approximate co-ordinates are: " + (res.location.lat || 0.000) + ", " + (res.location.lng || 0.0001) + " with an accuracy of " + (res.accuracy || 0.1234) + " meters." );
			callNumber(( process.env.CARETAKER_PHONE || "+14167990397"));
		}).catch(function(err){
			console.log(JSON.stringify(err));
		});
		macAddresses = [];
	}
}, 10000);


module.exports = router;