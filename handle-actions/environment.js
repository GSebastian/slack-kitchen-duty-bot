let liveServiceAccount = require("./kitchen-duty-423cd-firebase-adminsdk-cvvco-56cbd3f1b5.json");
let testServiceAccount = require("./kitchen-duty-test-firebase-adminsdk-dxpbl-cf1bc3eb3b.json");

let environment = "test"; // "live"

exports.getFirebaseDatabaseUrl = () => {
    if (environment == "test") {
        return "https://kitchen-duty-test.firebaseio.com"
    } else if (environment == "live") {
        return "https://kitchen-duty-423cd.firebaseio.com"
    }
};

exports.getFirebaseServiceAccount = () => {
    if (environment == "test") {
        return testServiceAccount;
    } else if (environment == "live") {
        return liveServiceAccount;
    }
};
