var alexa = require("alexa-app");
var alexaApp = new alexa.app("webhook");

alexaApp.launch(function (req, res) {
    res.say("You launched the app!");
});

alexaApp.intent("opportunityStatusIntent", function (req, res) {
    console.log(request.data.request.intent.slots);
    res.say("Success!").shouldEndSession(false);
});

module.exports = alexaApp;