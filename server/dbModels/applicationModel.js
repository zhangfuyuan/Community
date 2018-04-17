
const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let applicationSchema = new Schema({
    "applicationId": String,
    "kind" : String,
    "proposer" : String,
    "approver" : String,
    "startDate" : String,
    "startTime" : String,
    "endDate" : String,
    "endTime" : String,
    "remark" : String,
    "community" : String,
    "status" : String,
    "b2" : {
        "enterCommunity" : String,
        "materialImg" : String
    },
    "b3" : {
        "address" : String,
        "materialImg" : String
    },
    "b4" : {
        "address" : String
    },
    "b5" : {
        "address" : String
    },
    "b9" : {
        "address" : String,
        "cost" : String
    },
    "applicationTime" : Date
}, { collection: "Application" });

module.exports = mongoose.model("applicationModel", applicationSchema);
