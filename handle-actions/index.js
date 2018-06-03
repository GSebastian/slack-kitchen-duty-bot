var request = require("request");
var admin = require("firebase-admin");
var environment = require("./environment.js");

admin.initializeApp({
    credential: admin.credential.cert(environment.getFirebaseServiceAccount()),
    databaseURL: environment.getFirebaseDatabaseUrl()
});

var db = admin.database();

exports.handler = (event, context, callback) => {
    console.log(event);
    let input = event;
    findTeamForThisWeek(team => {
        console.log("Found team");
        if (input.actions[0].value == "who") {

            var teamsResponse = "This week\'s team is " + team.teamName + " formed of: "
            for (var i = 0; i < team.members.length; i++) {
                teamsResponse += "<@" + team.members[i].slackUserId + ">";
                if (i == team.members.length - 2) {
                    teamsResponse += " and ";
                } else if (i < team.members.length - 2) {
                    teamsResponse += ", ";
                }
            }
            console.log("Teams response: " + teamsResponse);
            request({
                url: input.response_url,
                method: "POST",
                json: true,
                body: { text: teamsResponse }
            }, function (error, response, body) {
                console.log("Who response " + body + " error " + error);
                if (error) {
                    callback(error, null);
                    context.fail(error);
                } else {
                    callback(null, "Successfully made \'who\' request");
                    context.succeed();
                }
            });
        } else if (input.actions[0].value == "nudge") {
            var teamsResponse = "This week\'s team is " + team.teamName + " formed of: "
            for (var i = 0; i < team.members.length; i++) {
                request({
                    url: "https://slack.com/api/im.open",
                    method: "POST",
                    json: true,
                    headers: {
                        "Authorization": "Bearer xoxp-2661812405-28277157233-359158844402-7bc02a78b9908613aedce544eea690d2"
                    },
                    body: {
                        user: team.members[i].slackUserId
                    }
                }, function (error, response, body) {
                    if (error == null) {
                        request({
                            url: "https://slack.com/api/chat.postMessage",
                            method: "POST",
                            json: true,
                            headers: {
                                "Authorization": "Bearer xoxp-2661812405-28277157233-359158844402-7bc02a78b9908613aedce544eea690d2"
                            },
                            body: {
                                channel: body.channel.id,
                                text: "🚨🚨🚨 Red alert! The kitchen is filthy! 🚨🚨🚨\n\n\n"
                                    + "Ok, maybe that was too dramatic, but would you mind making sure everything's ok in there? 👌"
                            }
                        }, function (error, response, body) {
                            console.log(body);
                        });
                    }
                });
            }
            request({
                url: input.response_url,
                method: "POST",
                json: true,
                body: { text: "I've just sent a message to everyone in this week\'s team! 💨 Chop chop! 💨 " }
            }, function (error, response, body) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(error, "Successfully made \'nudge\' request");
                }
            });
        } else {
            callback("Bad input", null)
        }
    })
};

function weeksFromStartDate(callback) {
    var ref = db.ref("/flamelink/environments/production/content/teamPlanning/en-US");
    ref.once("value", function (data) {
        let teamPlanningObject = data.val();

        console.log("TeamPlanning object startTime: " + teamPlanningObject.startTime);

        let startDate = new Date(teamPlanningObject.startTime);
        var currentDate = new Date();

        var diffWeeks = Math.round((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000));

        console.log("Weeks from start date: " + diffWeeks);

        callback(diffWeeks);
    });
};

function numberOfTeams(callback) {
    var ref = db.ref("/flamelink/environments/production/content/team/en-US");
    ref.once("value", function (data) {
        console.log("Number of teams: " + data.numChildren())
        callback(data.numChildren());
    });
}

function findTeamForThisWeek(callback) {
    weeksFromStartDate(weeksValue => {
        numberOfTeams(number => {
            // Team order is 1-indexed (for a friendlier CMS experience)
            let teamIndex = weeksValue % number + 1;

            var teamsRef = db.ref("/flamelink/environments/production/content/team/en-US");

            teamsRef.once("value", function (snapshot) {
                snapshot.forEach(function (data) {
                    let teamObject = data.val();
                    if (teamObject.order == teamIndex) {

                        console.log("Picked team: " + teamObject);

                        callback(teamObject);
                        return true;
                    }
                })
            });
        })
    });
}