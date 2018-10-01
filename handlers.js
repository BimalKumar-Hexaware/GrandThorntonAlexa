var alexa = require("alexa-app");
var alexaApp = new alexa.app("test");

oppStatusIntent = false;
oppFilterIntent = false;
revenueRangeIntent = false;
dateIntent = false;
oppStatus = "";
oppFilter = "";
revenueRange = "";
number = "";
date = "";

alexaApp.launch(function (req, res) {
    res.say("You launched the app!").shouldEndSession(false);
});

alexaApp.intent("testIntent", function (req, res) {
    res.say("Success!").shouldEndSession(false);
});

alexaApp.intent("oppStatusIntent", function (req, res) {
    oppStatusIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    oppStatus = req.data.request.intent.slots.status.value;

    res.say("You can filter the opportunities by date and estimated revenue. Which one you want?").shouldEndSession(false);
});

alexaApp.intent("oppFilterIntent", function (req, res) {
    oppFilterIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    oppFilter = req.data.request.intent.slots.filter.value;
    if (oppFilter == "revenue") {
        res.say("Please mention the range").shouldEndSession(false);
    } else if (oppFilter == "date") {
        res.say("Please mention the date").shouldEndSession(false);
    }
});

alexaApp.intent("revenueRangeIntent", function (req, res) {
    revenueRangeIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    revenueRange = req.data.request.intent.slots.revenuerange.value;
    number = req.data.request.intent.slots.number.value;
    res.say("fire api").shouldEndSession(false);
});

alexaApp.intent("dateIntent", function (req, res) {
    dateIntent = true;
    console.log("Slots", req.data.request.intent.slots);
    date = req.data.request.intent.slots.date.value;
    res.say("fire api").shouldEndSession(false);
});

module.exports = alexaApp;