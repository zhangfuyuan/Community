var express = require('express');
var router = express.Router();

const UserModel = require('../dbModels/userModel');
const WorkOrderModel = require('../dbModels/workOrderModel');
const NoticeModel = require('../dbModels/noticeModel');
const ApplicationModel = require('../dbModels/applicationModel');
const AdviseModel = require('../dbModels/adviseModel');
const BannerModel = require('../dbModels/bannerModel');
const CommunityModel = require('../dbModels/communityModel');
const MerchantModel = require('../dbModels/merchantModel');

/* GET 用于测试 */
router.get('/test', function(req, res, next) {
    let resItems = [],
        reqWorkOrderItems = [],
        reqNoticeItems = [];

    NoticeModel.find({ "community": "社区1" }).exec(function (noticeErr, noticeDoc) {
        if (noticeErr) {
            return res.json({
                status: 500,
                msg: noticeErr.message
            });
        }

        noticeDoc.map((item)=>{ if (reqNoticeItems.indexOf(item.noticeId) === -1) resItems.push(item); });

        WorkOrderModel.find({ "proposer": "13112201239" }).exec(function (workOrderErr, workOrderDoc) {
            if (workOrderErr) {
                return res.json({
                    status: 500,
                    msg: workOrderErr.message
                });
            }

            let reqWorkOrderIdItems = [], curItemInReqIndex;

            reqWorkOrderItems.map((item)=>{
                reqWorkOrderIdItems.push(item.workOrderId);
            });
            workOrderDoc.map((item)=>{
                curItemInReqIndex = reqWorkOrderIdItems.indexOf(item.workOrderId);

                if ((curItemInReqIndex === -1) ||
                    (curItemInReqIndex > -1 && reqWorkOrderItems[curItemInReqIndex].status !== item.status)) {
                    resItems.push(item);
                }
            });

            res.json({
                status: 200,
                msg: "获取新消息数据成功",
                data: resItems
            })
        });
    });
});

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
            msg: "还未登录"
        });
    }
});

/* POST 登录/注册 */
router.post('/login', function(req, res, next) {
    let username = req.body.username,
        password = req.body.password;

    UserModel.findOne({ "username": username }, (err, doc)=>{
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        if (!doc) {
            let newUser = new UserModel({
                "userid": 'a' + Date.now(),
                "username": username,
                "nickname" : "",
                "password": password,
                "identity": "user",
                "community": "",
                "remark": ""
            });

            newUser.save((newErr, newDoc)=>{
                if (newErr) {
                    return res.json({
                        status: 500,
                        msg: newErr.message
                    });
                }

                res.cookie('token', newDoc.userid, { maxAge: 1000*60*5, httpOnly: true });
                res.json({
                    status: 200,
                    msg: "注册成功",
                    data: newDoc
                });
            })
        } else {

            if (password === doc.password) {
                res.cookie('token', doc.userid, { maxAge: 1000*60*5, httpOnly: true });
                res.json({
                    status: 200,
                    msg: "登录成功",
                    data: doc
                });
            } else {
                res.json({
                    status: 404,
                    msg: "账号或密码不正确"
                });
            }
        }
    });

});

/* GET 登出 */
router.get('/logout', function(req, res, next) {
    res.clearCookie('token');
    res.json({
        status: 200,
        msg: "登出成功"
    });
});

module.exports = router;
