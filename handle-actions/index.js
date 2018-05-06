var request = require('request');
var admin = require("firebase-admin");
var serviceAccount = require("kitchen-duty-423cd-firebase-adminsdk-cvvco-56cbd3f1b5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kitchen-duty-423cd.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("/flamelink/environments/production/content/team/en-US");

exports.handler = (event, context, callback) => {
    if (event.actions[0].value == "who") {
        callback(null, { text : "Please wait" })
        ref.once("value", function(data) {
            var teamsResponse = { text : "This is a team" }
                request({
                    url: event.response_url,
                    method: "POST",
                    json: true,
                    body: teamsResponse
                }, function (error, response, body){
                    console.log(response);
                });
        });
    } else if (event.actions[0].value == "nudge") {
        callback(null, {
            text: "Thanks! I\'ve just sent them a short reminder to sort the kitchen."
        })
    } else {
        callback("Bad input", null)
    }
};