
const mongoose = require('./db.js'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId; //ObjectId为内置数据类型

let userSchema = new Schema({
    "userid": String,
    "username": String,
    "nickname" : String,
    "password": String,
    "identity": String,
    "community": String,
    "remark": String
}, { collection: "Users" }); //collection值为映射的数据表名

module.exports = mongoose.model("userModel", userSchema);
