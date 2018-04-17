
const mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let workOrderSchema = new Schema({
    "workOrderId": String,
    "kind" : String,
    "status" : String,
    "evaluate" : String,
    "proposer" : String,
    "approver" : String,
    "startDate" : String,
    "startTime" : String,
    "endDate" : String,
    "endTime" : String,
    "remark" : String,
    "community" : String
}, { collection: "WorkOrder" });

module.exports = mongoose.model("workOrderModel", workOrderSchema);
