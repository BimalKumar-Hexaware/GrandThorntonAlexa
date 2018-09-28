'use strict';
var express = require("express");
var alexaApp = require("./handlers");

var app = express();
const PORT = process.env.PORT || 5000;

alexaApp.express({
    expressApp: app,
    checkCert: false,
    debug: true
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}, try http://localhost:${PORT}/test`);
});