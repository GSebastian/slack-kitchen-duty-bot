var request = require('request');
var admin = require("firebase-admin");
var serviceAccount = require("./kitchen-duty-423cd-firebase-adminsdk-cvvco-56cbd3f1b5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kitchen-duty-423cd.firebaseio.com"
});

var db = admin.database();

exports.handler = (event, context, callback) => {
    if (event.actions[0].value == "who") {
        callback(null, { text : "Please wait" })
        context.done()
        
        findTeamForThisWeek(team => {
            var teamsResponse = "This week\'s team is " + team.teamName + " formed of: "
            for (var i = 0; i < team.members.length; i++) {
                teamsResponse += "<@" + team.members[i].slackUserId + ">";
                if (i == team.members.length - 2) {
                    teamsResponse += " and ";
                } else if (i < team.members.length - 2) {
                    teamsResponse += ", ";
                }
            }
            request({
                url: event.response_url,
                method: "POST",
                json: true,
                body: { text : teamsResponse }
            }, function (error, response, body){
                console.log(response);
            });
        })
    } else if (event.actions[0].value == "nudge") {
        callback(null, {
            text: "Thanks! I\'ve just sent them a short reminder to sort the kitchen."
        })
    } else {
        callback("Bad input", null)
    }
};

function weeksFromStartDate(callback) {
    var ref = db.ref("/flamelink/environments/production/content/teamPlanning/en-US");
    ref.once("value", function(data) {
        let teamPlanningObject = data.val();
        let startDate = new Date(teamPlanningObject.startTime);

        var oneDay = 24 * 60 * 60 * 1000;
        var currentDate = new Date();

        var diffWeeks = Math.round(Math.abs((startDate.getTime() - currentDate.getTime()) / (oneDay)) / 7);

        callback(diffWeeks);
    });
};

function numberOfTeams(callback) {
    var ref = db.ref("/flamelink/environments/production/content/team/en-US");
    ref.once("value", function(data) {
        callback(data.numChildren());
    });
}

function findTeamForThisWeek(callback) {
    weeksFromStartDate(weeksValue => {
        numberOfTeams(number => {
            // Team order is 1-indexed (for a friendlier CMS experience)
            let teamIndex = weeksValue % number + 1;
            var teamsRef = db.ref("/flamelink/environments/production/content/team/en-US");

            teamsRef.once("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    let teamObject = data.val();
                    if (teamObject.order == teamIndex) {
                        callback(teamObject);
                        return true;
                    }
                })
            });
        })
    });
}