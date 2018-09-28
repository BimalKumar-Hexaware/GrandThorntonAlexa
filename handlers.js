var alexa = require("alexa-app");
var alexaApp = new alexa.app("test");

alexaApp.launch(function (req, res) {
    res.say("You launched the app!").shouldEndSession(false);
});

alexaApp.intent("testIntent", function (req, res) {
    res.say("Success!").shouldEndSession(false);
});

alexaApp.intent("oppStatusIntent", function (req, res) {
    console.log("Slots", req.data.request.intent.slots);
    res.say("Success!").shouldEndSession(false);
});

module.exports = alexaApp;