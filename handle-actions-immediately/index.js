var aws = require('aws-sdk');
var lambda = new aws.Lambda({
    region: 'eu-west-2'
});

exports.handler = (event, context, callback) => {
    if (event.actions == null) {
        callback("Bad input", null);
    }
    if (event.actions[0].value == "who" || event.actions[0].value == "nudge") {
        lambda.invoke({
            FunctionName: 'slack-kitchen-duty-bot-handle-actions',
            Payload: JSON.stringify(event, null, 2),
            InvocationType: 'Event'
        }, function (error, data) {
            if (error) {
                callback(error, null)
            } else {
                callback(null, {
                    text: "⚡️ Crunching the numbers ... \n\n Proving String Theory 💡\n\n " +
                        "Almost there ..."
                });
            }
        });
    } else {
        callback("Bad input", null);
    }
};