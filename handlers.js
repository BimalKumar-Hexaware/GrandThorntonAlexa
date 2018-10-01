var alexa = require("alexa-app");
var alexaApp = new alexa.app("test");
var helper = require('./helper');

oppStatusIntent = false;
oppFilterIntent = false;
revenueRangeIntent = false;
dateIntent = false;
oppStatus = "";
oppFilter = "";
number = "";
revenuerange = "";
date = "";

alexaApp.launch(function (req, res) {
    res.say("Hi there, I am your Grand Thornton Assistant. Tell me how can I help you.").shouldEndSession(false);
});

alexaApp.intent("testIntent", function (req, res) {
    res.say("Success!").shouldEndSession(false);
});

alexaApp.intent("oppStatusIntent", function (req, res) {
    oppStatusIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    oppStatus = req.data.request.intent.slots.status.value;

    res.say("You can filter the opportunities by date and revenue. Which one you want?").shouldEndSession(false);
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
    revenueRangeIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    number = req.data.request.intent.slots.number.value;
    revenuerange = req.data.request.intent.slots.revenuerange.value;
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
    console.log(params);
    return helper.callDynamicsAPI(params).then((result) => {
        var ssml = helper.buildSsml(result);
        console.log("SSML", ssml);
        res.say(ssml).shouldEndSession(false);
    }).catch((err) => {
        res.say("Sorry, something went wrong").shouldEndSession(false);
    });
});

alexaApp.intent("dateIntent", function (req, res) {
    dateIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    date = req.data.request.intent.slots.date.value;
    var params = {
        "date": date,
        "oppstatus": oppStatus,
        "filters": 'createdon'
    };
    console.log(params);
    return helper.callDynamicsAPI(params).then((result) => {
        var ssml = helper.buildSsml(result);
        console.log("SSML", ssml);
        res.say(ssml).shouldEndSession(false);
    }).catch((err) => {
        res.say("Sorry, something went wrong").shouldEndSession(false);
    });
});

alexaApp.intent("thankIntent", function (req, res) {
    res.say("happy to help you. Have a nice day.").shouldEndSession(true);
});

module.exports = alexaApp;