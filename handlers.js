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
low = "";
high = "";

alexaApp.launch(function (req, res) {
    res.say("Hi there, I am your Grand Thornton Assistant. Tell me how can I help you.").shouldEndSession(false);
});

alexaApp.intent("oppStatusIntent", function (req, res) {
    oppStatusIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    oppStatus = req.data.request.intent.slots.status.value;
    if (oppStatus == "" || typeof oppStatus == "undefined") {
        console.log("oppstatus empty");
        res.say("Please tell us the status in which want to see the opportunities, open or closed").shouldEndSession(false);
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
    }
    console.log("PARAMS", params);
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
    console.log("Slots", JSON.stringify(req.slots));
    date = req.data.request.intent.slots.date.value;
    if (date == "" || typeof date == "undefined") {
        // console.log(req.data);
        var condition = req.slots.condition.resolutions;
        console.log(condition);
        if(condition.length === 0 || typeof condition === "undefined"){
            console.log(1)
            startDate = req.data.request.intent.slots.startDate.value;
            endDate = req.data.request.intent.slots.startDate.value;
            monthName = req.data.request.intent.slots.monthName.value;
            quarterly  = req.slots.quarterly.value;

            if((startDate !== "" && typeof startDate !== "undefined") && (endDate !== "" && typeof endDate !== "undefined")) {
                var params = {
                    "startDate":startDate,
                    "endDate":endDate,
                    "condition": 'inBetween',
                    "oppstatus": oppStatus,
                    "filters": 'createdon'
                };
            } else if(monthName !== "" && typeof monthName !== "undefined") {
                var params = {
                    "monthName":monthName,
                    "condition": 'month',
                    "oppstatus": oppStatus,
                    "filters": 'createdon'
                };
            } else if(quarterly !== "" && typeof quarterly !== "undefined") {
                var params = {
                    "quaterType":quarterly[0].values[0].name,
                    "condition": 'quarterly',
                    "oppstatus": oppStatus,
                    "filters": 'createdon'
                };
            }
        } else {
            console.log(2)

            var params = {
                "condition": condition[0].values[0].name,
                "oppstatus": oppStatus,
                "filters": 'createdon'
            };
        }
       
    } else {
        var params = {
            "date": date,
            "oppstatus": oppStatus,
            "filters": 'createdon'
        };
    }
    console.log("PARAMS", params);
    return helper.callDynamicsAPI(params).then((result) => {
        var ssml = helper.buildSsml(result);
        console.log("SSML", ssml);
        res.say(ssml).shouldEndSession(false);
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

module.exports = alexaApp;