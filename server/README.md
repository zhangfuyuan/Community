# CommunityServer

  CommunityServer 是 Community APP 的基于 Node.js + Express + Nodemon + Mongoose 搭建的服务器 + 数据库
  
## 搭建服务器流程

1. 基于 IDE 创建 `Node` + `Express` 项目

    > Node版本 -> 最新版v4.15.5
    >  
    > 模板引擎 -> ejs
    >  
    > 样式引擎 -> Sass
    
2. 使用 `nodemon` 优化启动方式，让每次修改代码后不需要重启

    >（1）安装
    
    ```
        // 全局安装：
        cnpm install -g nodemon
        
        // 本地安装：
        cnpm install --save-dev nodemon
    ```
    
    >（2）在 `package.json` 里面配置快捷启动方式
    
    ```
        "scripts": {
            "start": "node ./bin/www",
            "dev": "nodemon ./bin/www" //添加此处！！！
        },
    ```
    
    >（3）此时启动方式是：
    
    ```
        npm run dev
    ```
    
3. 便于观察服务器启动情况，在 `bin/www` 文件添加如下代码：

    ```
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    ```
    
4. 重启服务器后，在浏览器地址栏输入 `http://localhost:3000` 可验证是否启动正常

## 搭建数据库流程

1. 使用 `Robo 3T` 可视化工具连接 `MongoDB` 数据库

    ```
        // 启动数据库 --dbpath 后为MongoDB安装路径下的data文件路径
        mongod --dbpath D:\MongoDB\data
    ```
  
2. 通过工具创建 `Community` 数据库，并创建相应的（测试）数据表，如 `Users` ，并插入一些数据：

    ```
        {
            userid: "1514736000000",
            username: "13888888888",
            nickname: "Jeffrey",
            password: "123456",
            identity: "admin"
        }
    ```
    
3. 安装 `mongoose` 模块

    ```
        npm i mongoose -D
    ```
    
4. 在根目录下新建一个 `dbModels` 目录，用于存放 连接库 和 设置映射模型表 文件：
   
    > 1. 新建 `db.js` 文件，用于设置连接数据库的地址和监听事件
        
    ```
        const mongoose = require('mongoose'),
            DB_URL = 'mongodb://localhost:27017/Community'; //默认端口27017；Community为数据库名
        
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

    ```
    
    >
    > 2. 新建 `userModel.js` 文件，用于设置映射模型表的初始值
    
    ```
        const mongoose = require('./db.js'),
            Schema = mongoose.Schema,
            ObjectId = Schema.ObjectId; //ObjectId为内置数据类型
        
        let userSchema = new Schema({
            "userid": String,
            "username": String,
            "nickname" : String,
            "password": String,
            "identity": String
        }, { collection: "Users" }); //collection值为映射的数据表名
        
        module.exports = mongoose.model("userModel", userSchema);
    ```
    
* 注意 `**Model.js` 文件都要引入 `db.js` 文件作为基础模块
    
5. 此时需要根据 Routes API 规则与风格，分为 `index.js` 和 `users.js` ，获取用户信息在 `users.js` 下配置：

    ```
        var express = require('express');
        var router = express.Router();
        const UserModel = require('../dbModels/userModel'); //引入文件模块为相对路径
        
        /* GET users listing. */
        router.get('/oneUser', function(req, res, next) {
        
            UserModel.findOne({ "userid": "1514736000000" }, (err, doc)=>{
                if (err) {
                    return res.json({
                        status: 500,
                        msg: err.message
                    });
                }
                
                if (!doc && typeof doc !== 'undefined' && doc !== 0) {
                    return res.json({
                        status: 404,
                        msg: "用户不存在",
                        data: doc
                    });
                }
        
                res.json({
                    status: 200,
                    msg: "获取一个用户信息成功",
                    data: doc
                });
            })
        
        });
        
        module.exports = router;
    ```
    
6. 重启服务器后，在浏览器地址栏输入 `http://localhost:3000/users/oneUser` 可验证是否正常获取数据

* `mongoose` 注意点：
    
    > * `Model.find().***.exec(function (err, doc) {})` -> `doc` 返回的是数组，判断空使用 `if (doc.length)`
    > * `Model.findOne(function (err, doc) {})` -> `doc` 返回的是对象/null，判断空使用 `if (!doc)`
    
* 更多学习：

    * [官方手册](http://mongoosejs.com/docs/api.html#model_Model.find)
    * [《Mongoose介绍和入门》](https://www.cnblogs.com/zhongweiv/p/mongoose.html)
    * [《Mongoose操作符》](https://blog.csdn.net/u010957293/article/details/51649551)
    * [《MongoDB操作符》](https://blog.csdn.net/sinat_29091823/article/details/75050950)
    
## 开发问题

###（一）利用 Cookie + Token 识别用户的登录状态【SPA应用】

1. 思路：
    
    >1. 出于单页面应用考虑，页面跳转控制权在前端，跳转拦截交给前端的一个全局登录状态变量
    >
    >2. 前端通过此全局变量拦截跳转、保护资源
    >
    >3. 因此，在应用入口就需要通过一个API请求服务端判断登录状态，从而更改全局登录状态变量的值
    >
    >4. 另外就只有登录请求时，更改全局登录状态变量的值
    
2. 服务端则需要负责一个 登录/注册 和一个 检验Token中登录信息 的API接口

    ```
        ...
        
        /* POST 检验Token中登录信息 */
        router.get('/check_token', function(req, res, next) {
            let token = req.cookies.token;
        
            if (token) {
                UserModel.findOne({ "userid": token }, (err, doc)=>{
                    if (err) {
                        return res.json({
                            status: 500,
                            msg: err.message
                        });
                    }
        
                    if (!doc) {
                        return res.json({
                            status: 404,
                            msg: "token非法"
                        });
                    }
        
                    res.json({
                        status: 200,
                        msg: "token合法",
                        data: doc
                    });
                });
            } else {
                res.json({
                    status: 404,
                    msg: "token非法"
                });
            }
        });
        
        /* POST 登录/注册 */
        router.post('/login', function(req, res, next) {
            let username = req.body.username,
                password = req.body.password;
        
            UserModel.findOne({ "username": username, "password": password }, (err, doc)=>{
                if (err) {
                    return res.json({
                        status: 500,
                        msg: err.message
                    });
                }
        
                if (!doc) {
                    let newUser = new UserModel({
                        "userid": Date.now() + '',
                        "username": username,
                        "nickname" : '',
                        "password": password,
                        "identity": 'user'
                    });
        
                    newUser.save((newErr, newDoc)=>{
                        if (newErr) {
                            return res.json({
                                status: 500,
                                msg: newErr.message
                            });
                        }
        
                        res.cookie('token', newDoc.userid, { maxAge: 1000*60, httpOnly: true });
                        res.json({
                            status: 200,
                            msg: "注册成功",
                            data: newDoc
                        });
                    })
                } else {
                    res.cookie('token', doc.userid, { maxAge: 1000*60, httpOnly: true });
                    res.json({
                        status: 200,
                        msg: "登录成功",
                        data: doc
                    });
                }
            });
        
        });
    ```
    
###（二）图片资源的上传与下载案例

  [案例1](https://cnodejs.org/topic/4f40a4dc0feaaa4424081758)
  
  [案例2](https://segmentfault.com/a/1190000005706031)
    
  [《Nodejs接收图片base64格式保存为文件》](https://segmentfault.com/a/1190000005364299)
  
* 解决413：
  
  [《nodejs express 413》](https://www.cnblogs.com/MDK-L/p/4088857.html)
  
  [《express 如何解决413 请求实体过长?》](https://cnodejs.org/topic/53db0ca3111cfedf0b72aaeb)
  
### （三）利用WebSocket实现聊天室功能

1. 方法一：`Socket.IO` （推荐）

    >1. 下载模块：
    ```
    
    ```

2. 方法二：`express-ws` （不推荐）

    >1. 下载 `express-ws` 模块
    ```
        npm install --save express-ws
    ```    
    >2. 在 `www` 新建 `express-ws` 设置模块
    
    ```
        /**
         * WebSocket router
         */
        var express = require('express');
        var expressWS = require('express-ws');
        var wsRouter = null;
        
        class WSRouter {
        
            constructor(server) {
                this.server = server;
                this.app = express();
                this.wsInstance = expressWS(this.app, this.server);
                this.msgItems = [];
                this.clients = [];
            }
        
           lintenClientConnect() {
                this.app.ws('/ws', (ws, req) => {
                    console.log('One client connect to WSServer successful');
                    this.clients = this.wsInstance.getWss('/ws').clients;
        
                    ws.on('message', (msg) => {
                        console.log('WSServer receive client msg :', msg);
        
                        this.msgItems.push(JSON.parse(msg));
                        this.clients.forEach((client) => {
                            client.send(JSON.stringify(this.msgItems));
                        });
                    });
        
                    ws.on('close', () => {
                        console.log("One client is closed");
        
                        this.clients = this.wsInstance.getWss('/ws').clients;
                    });
                });
            }
        
        }
        
        function init(server){
            if(wsRouter === null && server !== null){
                wsRouter = new WSRouter(server);
            }
            return wsRouter;
        }
        
        module.exports = init;
    ```   
    >3. 引入 `www` 文件：
    ```
        ...
        var server = http.createServer(app);
        var wsRouter = require('./socketBase')(server);
        wsRouter.lintenClientConnect();
    ```

* 参考：
  [《WebSocket 教程》](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
  [服务端：express-ws github 源代码](https://github.com/HenningM/express-ws) 
  [客户端：《Angular4-在线竞拍应用-与服务器通信》](https://blog.csdn.net/zsx157326/article/details/78410128)
  [正确使用express-ws：《Express Websocket使用》](https://www.jianshu.com/p/136da96d3d48)
  