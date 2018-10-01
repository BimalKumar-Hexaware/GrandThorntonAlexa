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

        var speechOutput = speech.ssml(true);
        if (typeof result.value !== 'undefined') {
            speech.say('Below are the opportunities.').pause('1s');
            _.forEach(result.value, function (value, key) {
                if (key < 3) {
                    speech.sayAs({ word: key + 1, interpret: 'ordinal' }).pause('500ms');
                    speech.say(value.name);
                    speech.say("and the revenue is " + value.estimatedvalue).pause('500ms');
                }
            });
        } else {
            speech.say('Unable to find opportunities.');
        }
        var speechOutput = speech.ssml(false);
        return speechOutput;
    }
};

module.exports = self;