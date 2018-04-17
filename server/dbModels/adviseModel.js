
const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let adviseSchema = new Schema({
    "adviseId": String,
    "kind" : String,
    "proposer" : String,
    "contact" : String,
    "content" : String,
    "community" : String
}, { collection: "Advise" });

module.exports = mongoose.model("adviseModel", adviseSchema);

