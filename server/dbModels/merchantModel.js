
const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let merchantSchema = new Schema({
    "merchantId": String,
    "name" : String,
    "community" : String,
    "attribute" : String,
    "authority" : String,
    "remark" : String
}, { collection: "Merchant" });

module.exports = mongoose.model("merchantModel", merchantSchema);
