
const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let communitySchema = new Schema({
    "communityId": String,
    "name" : String,
    "attribute" : String,
    "authority" : String,
    "remark" : String
}, { collection: "Community" });

module.exports = mongoose.model("communityModel", communitySchema);
