
const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let bannerSchema = new Schema({
    "bannerId": String,
    "pictureId" : String,
    "proposer" : String,
    "title" : String,
    "content" : String,
    "sendTime" : String
}, { collection: "Banner" });

module.exports = mongoose.model("bannerModel", bannerSchema);

