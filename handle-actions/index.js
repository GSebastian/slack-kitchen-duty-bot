var https = require('https');

exports.handler = (event, context, callback) => {
    if (event.actions[0].value == "who") {
        callback(null, {
            text: "This week it\'s Cleaning Team 4 which consists of:\nSeb\nElliot\nMiles"
        })
    } else if (event.actions[0].value == "nudge") {
        callback(null, {
            text: "Thanks! I\'ve just sent them a short reminder to sort the kitchen."
        })
    } else {
        callback("Bad input", null)
    }
};