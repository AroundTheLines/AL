'use strict';

var express = require('express');
var _ = require('lodash');
var request = require('request');
var twilio = require('twilio');

// Twilio Credentials
var accountSid = process.env.ACCOUNT_SID || 'ACf14e3ba903d05bddc9ca4c69e8be6d8d';
var authToken = process.env.AUTH_TOKEN || 'c6bdf749be21593d2073d7bd505ce705';
var FROM_NUMBER = '+12267792228';

// Create a Twilio REST API client for authenticated requests to Twilio
var client = twilio(accountSid, authToken);

var router = express.Router();

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
		    console.log(responseData.from); // outputs "+14506667788"
		});
	});
};

// Customize the call response message
router.post('/call_voice', function(req, res){
	var resp = new twilio.TwimlResponse();

	resp.say('Your patient is roaming. Please check their location from your text messages.', {
    	voice:'alice',
    	language:'en-us'
	});

	console.log(resp.toString());
	res.type('text/xml');
	res.send(resp.toString());
});

router.post('/alert_helper', function(req, res){
	//console.log(req.headers);
	console.log(req.body.number);
	textNumber(req.body.number, "Your patient is roaming! Approximate co-ordinates are: " + (req.body.lat || 0.000) + "," + (req.body.lng || 0.0001));
	callNumber(req.body.number).catch(function(err){
		console.log(err);
		console.log(req.headers);
	});
	res.send('processed');
});



module.exports = router;