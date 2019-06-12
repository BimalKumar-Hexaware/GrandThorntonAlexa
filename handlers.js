var alexa = require("alexa-app");
var alexaApp = new alexa.app("test");
var helper = require('./helper');
var Speech = require('ssml-builder');
var converter = require('number-to-words');

var fallbackIntents = ['What was that?', 'Hmm. I am not sure about that.', 'Sorry. I am not sure about that.', 'I dont know that'];
oppStatusIntent = false;
oppFilterIntent = false;
revenueRangeIntent = false;
dateIntent = false;
oppStatus = "";
oppFilter = "";
number = "";
revenuerange = "";
date = "";
low = "";
high = "";
repeatContent = {};

alexaApp.error = function (exception, req, res) {
    console.log(exception);
    console.log("inside error handler");
    res.say("Sorry, something bad happened").shouldEndSession(false);
};

alexaApp.intent("AMAZON.FallbackIntent", function (req, res) {
    console.log("AMAZON.FallbackIntent");
    res.say(fallbackIntents[Math.floor(Math.random() * fallbackIntents.length)]).shouldEndSession(false);
});

alexaApp.intent("AMAZON.StopIntent", function (request, response) {
    console.log("Inside AMAZON.StopIntent");
    var stopOutput = "Don't You Worry. I'll be back.";
    response.say(stopOutput).shouldEndSession(true);
});

alexaApp.intent("AMAZON.CancelIntent", function (request, response) {
    console.log("Inside AMAZON.CancelIntent");
    response.say("No problem. Request cancelled.").shouldEndSession(false);
});

alexaApp.launch(function (req, res) {
    res.say("Hi Steve, I am your Grand Thornton Assistant. Tell me how can I help you.").shouldEndSession(false);
});

alexaApp.intent("oppStatusIntent", function (req, res) {
    oppStatusIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    oppStatus = req.data.request.intent.slots.status.value;
    if (oppStatus == "" || typeof oppStatus == "undefined") {
        console.log("oppstatus empty");
        res.say("Please tell us the status in which want to see the opportunities, open,close,won or lost").shouldEndSession(false);
    } else {
        res.say("You can filter the opportunities by date and revenue. Which one you want?").shouldEndSession(false);
    }
});

alexaApp.intent("oppFilterIntent", function (req, res) {
    oppFilterIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    oppFilter = req.data.request.intent.slots.filter.value;
    if (oppFilter == "revenue" || oppFilter == 'estimated revenue') {
        res.say("Please mention the range").shouldEndSession(false);
    } else if (oppFilter == "date") {
        res.say("Please mention the date").shouldEndSession(false);
    }
});

alexaApp.intent("revenueRangeIntent", function (req, res) {
    console.log("inside revenueRangeIntent");
    revenueRangeIntent = true;
    filterRange = '';
    repeatContent = {};
    console.log("Slots", req.data.request.intent.slots);
    number = req.data.request.intent.slots.number.value;
    revenuerange = req.data.request.intent.slots.revenuerange.value;
    if (revenuerange == "" || typeof revenuerange == "undefined") {
        high = req.data.request.intent.slots.high.value;
        low = req.data.request.intent.slots.low.value;
        console.log("low high defined");
        var params = {
            "high": high,
            "low": low,
            "oppstatus": oppStatus,
            "filters": 'estimatedvalue'
        };
        filterRange = "with Revenue between "+ converter.toWords(low) +" to "+ converter.toWords(high);
    } else {
        console.log("range defined");
        var params = {
            "number": number,
            "oppstatus": oppStatus,
            "filters": 'estimatedvalue'
        };
        switch (revenuerange) {
            case 'equals':
                params.ranges = "eq";
                break;
            case 'not equal':
                params.ranges = "ne";
                break;
            case 'less than or equal':
                params.ranges = "le";
                break;
            case 'less than':
                params.ranges = "lt";
                break;
            case 'greater than':
                params.ranges = "gt";
                break;
            case 'greater than or equal':
                params.ranges = "ge";
                break;
        }
        filterRange = "with Revenue "+ revenuerange + converter.toWords(number);
    }
    console.log("PARAMS", params);
    return helper.callDynamicsAPI(params).then((result) => {
        var ssml = helper.buildSsml(oppStatus,filterRange, result);
        console.log("SSML", ssml);
        res.say(ssml).shouldEndSession(false);
    }).catch((err) => {
        res.say("Sorry, something went wrong").shouldEndSession(false);
    });
});

alexaApp.intent("combinedRevenueIntent", function (req, res) {
    console.log("inside combinedRevenueIntent");
    console.log("Slots", req.data.request.intent.slots);
    oppStatus = req.data.request.intent.slots.status.value;
    filterRange = '';
    repeatContent = {};
    if (oppStatus == "" || typeof oppStatus == "undefined") {
        console.log("oppstatus empty");
        res.say("Please tell us the status in which want to see the opportunities, open,closed,won or lost").shouldEndSession(false);
    } else {
        number = req.data.request.intent.slots.number.value;
        revenuerange = req.data.request.intent.slots.revenuerange.value;
        if (revenuerange == "" || typeof revenuerange == "undefined") {
            high = req.data.request.intent.slots.high.value;
            low = req.data.request.intent.slots.low.value;
            console.log("low high defined");
            var params = {
                "high": high,
                "low": low,
                "oppstatus": oppStatus,
                "filters": 'estimatedvalue'
            };
            filterRange = "with Revenue between "+ converter.toWords(low) +" to "+ converter.toWords(high);
        } else {
            console.log("range defined");
            var params = {
                "number": number,
                "oppstatus": oppStatus,
                "filters": 'estimatedvalue'
            };
            switch (revenuerange) {
                case 'equals':
                    params.ranges = "eq";
                    break;
                case 'not equal':
                    params.ranges = "ne";
                    break;
                case 'less than or equal':
                    params.ranges = "le";
                    break;
                case 'less than':
                    params.ranges = "lt";
                    break;
                case 'greater than':
                    params.ranges = "gt";
                    break;
                case 'greater than or equal':
                    params.ranges = "ge";
                    break;
            }
            filterRange = "with Revenue "+ revenuerange + converter.toWords(number);
        }
        console.log("PARAMS", params);
        return helper.callDynamicsAPI(params).then((result) => {
            repeatContent = {
                'oppStatus': oppStatus,
                'filterRange': filterRange,
                'result':result
            };
            var ssml = helper.buildSsml(oppStatus, filterRange, result);
            console.log("SSML", ssml);
            res.say(ssml).shouldEndSession(false);
        }).catch((err) => {
            res.say("Sorry, something went wrong").shouldEndSession(false);
        });
    }
});

alexaApp.intent("dateIntent", function (req, res) {
    dateIntent = true;
    console.log("Slots", JSON.stringify(req.slots));
    date = req.data.request.intent.slots.date.value;
    filterRange = '';
    repeatContent = {};
    console.log(date);
    if (date !== "" && typeof date !== "undefined") {
        if (date.match(/^\d{4}-W\d/g)) {
            req.slots.condition.resolutions = [{
                values: [{
                    name: 'this-week'
                }]
            }];
            date = "";
        }
    }
    if (date == "" || typeof date == "undefined") {
        // console.log(req.data);
        var condition = req.slots.condition.resolutions;
        console.log(condition);
        if (condition.length === 0 || typeof condition === "undefined") {
            console.log(1)
            startDate = req.data.request.intent.slots.startDate.value;
            endDate = req.data.request.intent.slots.startDate.value;
            monthName = req.data.request.intent.slots.monthName.value;
            quarterly = req.slots.quarterly.resolutions;

            if ((startDate !== "" && typeof startDate !== "undefined") && (endDate !== "" && typeof endDate !== "undefined")) {
                var params = {
                    "startDate": startDate,
                    "endDate": endDate,
                    "condition": 'inBetween',
                    "oppstatus": oppStatus,
                    "filters": 'createdon'
                };
                filterRange = "between"+startDate+" to "+endDate;
            } else if (monthName !== "" && typeof monthName !== "undefined") {
                var params = {
                    "monthName": monthName,
                    "condition": 'month',
                    "oppstatus": oppStatus,
                    "filters": 'createdon'
                };
                filterRange = "for the month of "+monthName;
            } else if (quarterly.length !== 0 && typeof quarterly !== "undefined") {
                var params = {
                    "quaterType": quarterly[0].values[0].name,
                    "condition": 'quarterly',
                    "oppstatus": oppStatus,
                    "filters": 'createdon'
                };
                filterRange = "for the quarter "+quarterly[0].values[0].name;
            }
        } else {
            console.log(2)

            var params = {
                "condition": condition[0].values[0].name,
                "oppstatus": oppStatus,
                "filters": 'createdon'
            };
            filterRange = "for "+condition[0].values[0].name;
        }

    } else {
        var params = {
            "date": date,
            "oppstatus": oppStatus,
            "filters": 'createdon'
        };
        filterRange = "on "+date;
    }
    console.log("PARAMS", params);
    return helper.callDynamicsAPI(params).then((result) => {
        repeatContent = {
            'oppStatus': oppStatus,
            'filterRange': filterRange,
            'result':result
        };
        var ssml = helper.buildSsml(oppStatus,filterRange, result);
        console.log("SSML", ssml);
        res.say(ssml).shouldEndSession(false);
    }).catch((err) => {
        res.say("Sorry, something went wrong").shouldEndSession(false);
    });
});

alexaApp.intent('combinedDateIntent', function (req, res) {
    console.log("inside combinedDateIntent");
    console.log("Slots", req.data.request.intent.slots);
    oppStatus = req.data.request.intent.slots.status.value;
    filterRange = '';
    repeatContent = {};
    if (oppStatus == "" || typeof oppStatus == "undefined") {
        console.log("oppstatus empty");
        res.say("Please tell us the status in which want to see the opportunities, open,closed,Won or lost").shouldEndSession(false);
    } else {
        date = req.data.request.intent.slots.date.value;
        console.log("DATE", date);
        if (date !== "" && typeof date !== "undefined") {
            if (date.match(/^\d{4}-W\d/g)) {
                req.slots.condition.resolutions = [{
                    values: [{
                        name: 'this-week'
                    }]
                }];
                date = "";
            }
        }
        if (date == "" || typeof date == "undefined") {
            // console.log(req.data);
            var condition = req.slots.condition.resolutions;
            console.log(condition);
            if (condition.length === 0 || typeof condition === "undefined") {
                console.log(1)
                startDate = req.data.request.intent.slots.startDate.value;
                endDate = req.data.request.intent.slots.startDate.value;
                monthName = req.data.request.intent.slots.monthName.value;
                quarterly = req.slots.quarterly.resolutions;
    
                if ((startDate !== "" && typeof startDate !== "undefined") && (endDate !== "" && typeof endDate !== "undefined")) {
                    var params = {
                        "startDate": startDate,
                        "endDate": endDate,
                        "condition": 'inBetween',
                        "oppstatus": oppStatus,
                        "filters": 'createdon'
                    };
                    filterRange = "between"+startDate+" to "+endDate;
                } else if (monthName !== "" && typeof monthName !== "undefined") {
                    var params = {
                        "monthName": monthName,
                        "condition": 'month',
                        "oppstatus": oppStatus,
                        "filters": 'createdon'
                    };
                    filterRange = "for the month of "+monthName;
                } else if (quarterly.length !== 0 && typeof quarterly !== "undefined") {
                    var params = {
                        "quaterType": quarterly[0].values[0].name,
                        "condition": 'quarterly',
                        "oppstatus": oppStatus,
                        "filters": 'createdon'
                    };
                    filterRange = "for the quarter "+quarterly[0].values[0].name;
                }
            } else {
                console.log(2)
    
                var params = {
                    "condition": condition[0].values[0].name,
                    "oppstatus": oppStatus,
                    "filters": 'createdon'
                };
                filterRange = "for "+condition[0].values[0].name;
            }
    
        } else {
            var params = {
                "date": date,
                "oppstatus": oppStatus,
                "filters": 'createdon'
            };
            filterRange = "on "+date;
        }
        console.log("PARAMS", params);
        return helper.callDynamicsAPI(params).then((result) => {
            repeatContent = {
                'oppStatus': oppStatus,
                'filterRange': filterRange,
                'result':result
            };
            var ssml = helper.buildSsml(oppStatus,filterRange, result);
            console.log("SSML", ssml);
            res.say(ssml).shouldEndSession(false);
        }).catch((err) => {
            res.say("Sorry, something went wrong").shouldEndSession(false);
        });
    }
});

alexaApp.intent("newsUpdatesIntent", function (req, res) {
    console.log("Inside newsUpdatesIntent");
    return helper.newsUpdatesAPI().then((result) => {
        console.log("NEWSes", result);
        var latestNews = result[Math.floor(Math.random() * result.length)];
        var speech = new Speech();
        speech.say("Reading the latest news update").pause('500ms');
        speech.sentence(latestNews);
        speech.sentence("Is there anything else that I can help you with?");
        var speechOutput = speech.ssml(false);
        res.say(speechOutput).shouldEndSession(false);
    }).catch((err) => {
        res.say("Sorry, something went wrong").shouldEndSession(false);
    });
});

alexaApp.intent("thankIntent", function (req, res) {
    oppStatusIntent = false;
    oppFilterIntent = false;
    revenueRangeIntent = false;
    dateIntent = false;
    oppStatus = "";
    oppFilter = "";
    number = "";
    revenuerange = "";
    date = "";
    res.say("Happy to help you. Have a nice day.").shouldEndSession(true);
});

alexaApp.intent("repeatIntent", function (req, res) {
    var ssml = helper.buildSsml(repeatContent.oppStatus,repeatContent.filterRange, repeatContent.result);
    console.log("SSML", ssml);
    res.say(ssml).shouldEndSession(false);
});

module.exports = alexaApp;