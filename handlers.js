var alexa = require("alexa-app");
var alexaApp = new alexa.app("test");

oppStatusIntent = false;
oppFilterIntent = false;
oppStatus = "";
oppFilter = "";

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

module.exports = alexaApp;