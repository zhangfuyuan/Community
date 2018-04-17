
const mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost:27017/Community';

/**
 *  连接数据库
 * */
mongoose.connect(DB_URL);

/**
 *  当连接成功的时候
 * */
mongoose.connection.on('connected', function() {
    console.log('Mongodb 连接成功 on ' + DB_URL);
});

/**
 *  当连接发生错误的时候
 * */
mongoose.connection.on('error', function(err) {
    console.log('Mongodb 连接出错：' + err);
});

/**
 *  当关闭连接数据库的时候
 * */
mongoose.connection.on('disconnected', function() {
    console.log('Mongodb 连接中断！');
});

module.exports = mongoose;
