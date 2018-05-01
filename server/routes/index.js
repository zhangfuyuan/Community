var express = require('express');
var router = express.Router();
var fs = require('fs');

const UserModel = require('../dbModels/userModel');
const WorkOrderModel = require('../dbModels/workOrderModel');
const NoticeModel = require('../dbModels/noticeModel');
const ApplicationModel = require('../dbModels/applicationModel');
const AdviseModel = require('../dbModels/adviseModel');
const BannerModel = require('../dbModels/bannerModel');
const CommunityModel = require('../dbModels/communityModel');
const MerchantModel = require('../dbModels/merchantModel');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/******************************************************* 消息类 *******************************************************/

/* POST 消息通知 */
router.post('/new_msg', function(req, res, next) {
    let reqUsername = req.body.username,
        reqCommunity = req.body.community,
        reqNoticeItems = req.body.noticeItems,
        reqWorkOrderItems = req.body.workOrderItems,
        resItems = [];

    NoticeModel.find({ "community": reqCommunity }).exec(function (noticeErr, noticeDoc) {
        if (noticeErr) {
            return res.json({
                status: 500,
                msg: noticeErr.message
            });
        }

        noticeDoc.map((item)=>{ if (reqNoticeItems.indexOf(item.noticeId) === -1) resItems.push(item); });

        WorkOrderModel.find({ "proposer": reqUsername }).exec(function (workOrderErr, workOrderDoc) {
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
                msg: "获取新消息成功",
                data: resItems
            })
        });
    });
});

/******************************************************* 公告类 *******************************************************/

/* GET 公告列表 */
router.get('/notice', function(req, res, next) {
    let reqCommunity = req.query.community;

    NoticeModel.find({ "community": reqCommunity }).exec(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "获取公告列表成功",
            data: doc
        })
    });
});

/* POST 公告 - 增：new + save() -> doc返回对象 */
router.post('/add_notice', function(req, res, next) {
    let reqDetail = req.body.detail,
        noticeModel = new NoticeModel(reqDetail);

    noticeModel.save(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "新增一条公告成功",
            data: doc
        })
    });
});

/* POST 公告 - 删：remove() -> doc返回{"ok":1,"n":1} */
router.post('/remove_notice', function(req, res, next) {
    let reqDetail = req.body.detail;

    NoticeModel.remove({ "noticeId": reqDetail["noticeId"] }, function(err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "删除一条公告成功",
            data: reqDetail
        })
    });
});

/* POST 公告 - 改：update()/updateOne() -> {n: 1, nModified: 1, ok: 1} */
router.post('/edit_notice', function(req, res, next) {
    let reqDetail = req.body.detail;

    NoticeModel.updateOne({ "noticeId": reqDetail["noticeId"] }, {
        "noticeId" : 'c' + Date.now(),
        "sendTime" : reqDetail["sendTime"],
        "publisher" : reqDetail["publisher"],
        "title" : reqDetail["title"],
        "content" : reqDetail["content"],
        "picture" : reqDetail["picture"],
        "community" : reqDetail["community"]
    }, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "修改一条公告成功",
            data: reqDetail
        })
    });
});

/****************************************************** Banner类 ******************************************************/

/* GET Banner详情 */
router.get('/banner', function(req, res, next) {
    let reqBannerId = req.query.bannerId;

    BannerModel.findOne({ "bannerId": reqBannerId }, function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        if (!doc) {
            return res.json({
                status: 404,
                msg: "找不到资源"
            });
        }

        res.json({
            status: 200,
            msg: "获取Banner详情成功",
            data: doc
        })
    });
});

/* GET Banner详情 */
router.get('/bannerItems', function(req, res, next) {
    BannerModel.find().exec(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "获取Banner列表成功",
            data: doc
        })
    });
});

/* GET Banner详情 */
router.post('/edit_banner', function(req, res, next) {
    let reqDetail = req.body.detail;

    BannerModel.updateOne({ "bannerId": reqDetail["bannerId"] }, reqDetail, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "发布Banner成功",
            data: reqDetail
        })
    });
});

/******************************************************* 工单类 *******************************************************/

/* GET 工单列表 */
router.get('/workOrder', function(req, res, next) {
    let reqIsUser = req.query.isUser,
        reqKey = req.query.key,
        reqStatus = req.query.status,
        reqKind = req.query.kind;

    WorkOrderModel.find({
        [reqIsUser==='true'?"proposer":"community"]: reqKey,
        "status": { $regex: new RegExp(reqStatus) },
        "kind": { $regex: new RegExp(reqKind) }
    }).sort({ "workOrderId": -1 }).exec(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "获取工单列表成功",
            data: doc
        })
    });
});

/* POST 工单 - 增：new + save() -> doc返回对象 */
router.post('/add_workOrder', function(req, res, next) {
    let reqDetail = req.body.detail,
        workOrderModel = new WorkOrderModel(reqDetail);

    workOrderModel.save(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "新增一条工单成功",
            data: doc
        })
    });
});

/* POST 工单 - 删：remove() -> doc返回{"ok":1,"n":1} */
router.post('/remove_workOrder', function(req, res, next) {
    let reqDetail = req.body.detail;

    WorkOrderModel.remove({ "workOrderId": reqDetail["workOrderId"] }, function(err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "删除一条工单成功",
            data: reqDetail
        })
    });
});

/* POST 工单 - 改：update()/updateOne() -> {n: 1, nModified: 1, ok: 1} */
router.post('/edit_workOrder', function(req, res, next) {
    let reqDetail = req.body.detail;

    WorkOrderModel.updateOne({ "workOrderId": reqDetail["workOrderId"] }, reqDetail, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "修改一条工单成功",
            data: reqDetail
        })
    });
});

/* POST 工单 - 审批：update()/updateOne() -> {n: 1, nModified: 1, ok: 1} */
router.post('/approve_workOrder', function(req, res, next) {
    let reqWorkOrderId = req.body.workOrderId,
        reqReply = req.body.reply,
        reqReplier = req.body.replier;

    WorkOrderModel.updateOne({ "workOrderId": reqWorkOrderId }, { "status": reqReply, "approver": reqReplier }, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "审批一条公告成功"
        })
    });
});

/* GET 工单 - 打印：update()/updateOne() -> {n: 1, nModified: 1, ok: 1} */
router.get('/print_workOrder', function(req, res, next) {
    let reqWorkOrderId = req.query.workOrderId;

    if (!reqWorkOrderId) {
        return res.render('index', {
            title: '请求出错',
            err: {
                status: 400,
                stack: '请求参数出错'
            }
        });
    }

    WorkOrderModel.findOne({ "workOrderId": reqWorkOrderId }, function (err, doc) {
        if (err) {
            return res.render('index', {
                title: '服务器出错',
                err: err
            });
        }

        if (!doc) {
            return res.render('index', {
                title: '找不到资源',
                err: {
                    status: 404,
                    stack: '空'
                }
            });
        }

        res.render('workOrder', {
            workOrderId: doc.workOrderId,
            kind: doc.kind,
            status: doc.status,
            evaluate: doc.evaluate,
            proposer: doc.proposer,
            approver: doc.approver,
            time: doc.startDate+' '+doc.startTime+' ～ '+doc.endDate+' '+doc.endTime,
            remark: doc.remark,
            community: doc.community
        });
    });
});

/******************************************************* 申请类 *******************************************************/

/* GET 申请列表 */
router.get('/application', function(req, res, next) {
    let reqIsUser = req.query.isUser,
        reqKey = req.query.key,
        reqKind= req.query.kind;

    ApplicationModel.find({
        [reqIsUser==='true'?"proposer":(reqKind==='入驻申请'?"b2.enterCommunity":"community")]: reqKey,
        "kind": reqKind
    }).sort({ "applicationId": -1 }).exec(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "获取申请列表成功",
            data: doc
        })
    });
});

/* POST 申请 - 增：new + save() -> doc返回对象 */
router.post('/add_application', function(req, res, next) {
    let reqDetail = req.body.detail,
        reqBase64Image = req.body.base64Image,
        applicationModel = new ApplicationModel(reqDetail);

    applicationModel.save(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        if (!reqBase64Image) {
            return res.json({
                status: 200,
                msg: "新增一条申请成功",
                data: doc
            });
        }

        let base64Data = reqBase64Image.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64');
        let imgName = doc.applicationId;

        fs.writeFile('./public/images/' + imgName + '.jpg', dataBuffer, function(fsErr) {
            if(fsErr){
                console.log(fsErr);
                return res.json({
                    status: 500,
                    msg: '内部服务器出错'
                });
            }

            console.log(imgName + '.jpg图片保存成功');
            res.json({
                status: 200,
                msg: '新增一条申请并保存图片成功',
                data: doc
            });
        });
    });
});

/* POST 工单 - 删：remove() -> doc返回{"ok":1,"n":1} */
router.post('/remove_application', function(req, res, next) {
    let reqDetail = req.body.detail;

    ApplicationModel.remove({ "applicationId": reqDetail["applicationId"] }, function(err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "删除一条申请成功",
            data: reqDetail
        });
    });
});

/* POST 申请 - 改：update()/updateOne() -> {n: 1, nModified: 1, ok: 1} */
router.post('/edit_application', function(req, res, next) {
    let reqDetail = req.body.detail,
        reqBase64Image = req.body.base64Image;

    ApplicationModel.updateOne({ "applicationId": reqDetail["applicationId"] }, reqDetail, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        if (!reqBase64Image) {
            return res.json({
                status: 200,
                msg: "修改一条申请成功",
                data: reqDetail
            });
        }

        let base64Data = reqBase64Image.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64');
        let imgName = reqDetail.applicationId;

        fs.writeFile('./public/images/' + imgName + '.jpg', dataBuffer, function(fsErr) {
            if(fsErr){
                console.log(fsErr);
                return res.json({
                    status: 500,
                    msg: '内部服务器出错'
                });
            }

            console.log(imgName + '.jpg图片保存成功');
            res.json({
                status: 200,
                msg: '修改一条申请并保存图片成功',
                data: reqDetail
            });
        });
    });
});

/* POST 申请 - 审批：update()/updateOne() -> {n: 1, nModified: 1, ok: 1} */
router.post('/approve_application', function(req, res, next) {
    let reqApplicationId = req.body.applicationId,
        reqReply = req.body.reply,
        reqReplier = req.body.replier,
        reqKind = req.body.kind,
        reqProposer = req.body.proposer,
        reqEnterCommunity = req.body.enterCommunity;

    ApplicationModel.updateOne({ "applicationId": reqApplicationId }, { "status": reqReply, "approver": reqReplier }, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        if (reqKind !== '入驻申请') {
            return res.json({
                status: 200,
                msg: "审批一条申请成功"
            })
        }

        UserModel.updateOne({ "username": reqProposer }, { "community": reqEnterCommunity }, (uErr, uDoc)=>{
            if (uErr) {
                return res.json({
                    status: 500,
                    msg: uErr.message
                });
            }

            /* 找不到更新对象 */
            if (uDoc.nModified === 0) {
                return res.json({
                    status: 404,
                    msg: "信息不正确"
                });
            }

            res.json({
                status: 200,
                msg: "审批一条申请成功"
            });
        });
    });
});

/******************************************************* 投诉类 *******************************************************/

/* GET 投诉列表 */
router.get('/advise', function(req, res, next) {
    let reqCommunity = req.query.community;

    AdviseModel.find({ "community": reqCommunity }).sort({ "applicationId": -1 }).exec(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "获取投诉列表成功",
            data: doc
        })
    });
});

/* POST 投诉 - 增：new + save() -> doc返回对象 */
router.post('/add_advise', function(req, res, next) {
    let reqDetail = req.body.detail,
        adviseModel = new AdviseModel(reqDetail);

    adviseModel.save(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "提交建议成功",
            data: doc
        })
    });
});

/******************************************************* 社区类 *******************************************************/

/* GET 社区列表 */
router.get('/community', function(req, res, next) {
    CommunityModel.find({}).sort({ "communityId": -1 }).exec(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "获取社区列表成功",
            data: doc
        })
    });
});

/* POST 申请 - 增：new + save() -> doc返回对象 */
router.post('/add_community', function(req, res, next) {
    let reqDetail = req.body.detail,
        communityModel = new CommunityModel(reqDetail);

    communityModel.save(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "新增一个社区成功",
            data: doc
        });
    });
});

/* POST 申请 - 改：update()/updateOne() -> 200：{n: 1, nModified: 1, ok: 1} 404：{ n: 0, nModified: 0, ok: 1 } */
router.post('/edit_community', function(req, res, next) {
    let reqDetail = req.body.detail;

    CommunityModel.updateOne({ "communityId": reqDetail["communityId"] }, reqDetail, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "修改社区信息成功",
            data: reqDetail
        });
    });
});

/******************************************************* 商家类 *******************************************************/

/* GET 商家列表 */
router.get('/merchant', function(req, res, next) {
    MerchantModel.find({}).sort({ "merchantId": -1 }).exec(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "获取商家列表成功",
            data: doc
        })
    });
});

/* POST 管理 - 改：update()/updateOne() -> 200：{n: 1, nModified: 1, ok: 1} 404：{ n: 0, nModified: 0, ok: 1 } */
router.post('/edit_merchant', function(req, res, next) {
    let reqDetail = req.body.detail;

    MerchantModel.updateOne({ "merchantId": reqDetail["merchantId"] }, reqDetail, function(err, doc){
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "修改商家信息成功",
            data: reqDetail
        });
    });
});

/* POST 商家 - 增：new + save() -> doc返回对象 */
router.post('/add_merchant', function(req, res, next) {
    let reqDetail = req.body.detail,
        merchantModel = new MerchantModel(reqDetail);

    merchantModel.save(function (err, doc) {
        if (err) {
            return res.json({
                status: 500,
                msg: err.message
            });
        }

        res.json({
            status: 200,
            msg: "导入新商家成功",
            data: doc
        })
    });
});

module.exports = router;
