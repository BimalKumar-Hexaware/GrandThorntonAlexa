var request = require('request');
var _ = require('lodash');
var Speech = require('ssml-builder');

var self = {
    "callDynamicsAPI": function (params) {
        console.log('inside callDynamicsAPI');
        return new Promise(function (resolve, reject) {
            var options = {
                method: 'POST',
                url: 'http://ec2-18-232-207-49.compute-1.amazonaws.com:7500/opportunities',
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
    "buildSsml": function (result) {
        var speech = new Speech();
        speech.say('Below are the opportunities.')
            .pause('1s');
        var speechOutput = speech.ssml(true);
        if (typeof result.value !== 'undefined') {
            _.forEach(result.value, function (value, key) {
                if (key < 3) {
                    speech.sayAs({ word: key + 1, interpret: 'ordinal' });
                    speech.say(value.name);
                    speech.say("and the revenue is "+value.estimatedvalue);
                }
            });
        } else {
            speech.say('Unable to find opportunities.');
        }
        var speechOutput = speech.ssml(true);
        return speechOutput;
    }
};

module.exports = self;