var request = require('request');
var _ = require('lodash');
var Speech = require('ssml-builder');

var self = {
    "callDynamicsAPI": function (params) {
        console.log('inside callDynamicsAPI');
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: 'http://gtdynamics.us-east-1.elasticbeanstalk.com/opportunities',
                headers: {
                    'content-type': 'application/json'
                },
                body: params,
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log("callDynamicsAPI err", error);
                    reject("Something went wrong when processing your request. Please try again.");
                }
                resolve(body);
            });
        });
    },
    "buildSsml": function (oppStatus,filterRange, result) {
        var speech = new Speech();

        var speechOutput = speech.ssml(true);
        if (typeof result.value !== 'undefined') {
            speech.say(`These are the ${oppStatus} opportunities ${filterRange}`).pause('500ms');
            _.forEach(result.value, function (value, key) {
                console.log("VALUE", value);
                if (key < 5) {
                    speech.sayAs({ word: key + 1, interpret: 'ordinal' }).pause('500ms');
                    speech.say(value.name);
                    // if (oppStatus === 'close') {
                    //     speech.say("the revenue is " + value.estimatedvalue);
                    //     speech.say("and the status is ").pause('500ms');
                    // } else {
                    speech.say("and the revenue is " + value.estimatedvalue).pause('500ms');
                    // }
                }
            });
        } else {
            speech.say('There is no matching opportunities found for your request.');
        }
        speech.say('Is there anything else that I can help you with?.');
        var speechOutput = speech.ssml(false);
        return speechOutput;
    },
    "newsUpdatesAPI": function (params) {
        console.log('inside newsUpdatesAPI');
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: 'http://gtdynamics.us-east-1.elasticbeanstalk.com/twitterFeed',
                headers: {
                    'content-type': 'application/json'
                },
                body: params,
                json: true
            };
            request(options, function (error, response, body) {
                if (error) {
                    console.log("newsUpdatesAPI err", error);
                    reject("Something went wrong when processing your request. Please try again.");
                }
                resolve(body);
            });
        });
    }
};

module.exports = self;