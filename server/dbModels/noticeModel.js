
const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let noticeSchema = new Schema({
    "noticeId": String,
    "sendTime" : String,
    "publisher" : String,
    "title" : String,
    "content" : String,
    "picture" : String,
    "community" : String
}, { collection: "Notice" });

module.exports = mongoose.model("noticeModel", noticeSchema);
