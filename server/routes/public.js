var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET 图片资源 */
router.get('/images/:imgName', function(req, res, next) {
    let imgName = req.params.imgName;

    res.writeHead(200, {'Content-Type':'image/jpeg'});
    fs.readFile('./public/images/' + imgName, function(err, data){
        if (err) {
            console.log(err);
        } else{
            console.log("开始读取图片");
            res.write(data);
            res.end();
        }
    })
});

/* POST 上传图片 */
router.post('/upload', function(req, res){
    //接收前台POST过来的base64
    let imgData = req.body.imgData;
    console.log(imgData.length);
    //过滤data:URL
    let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    let imgName = Date.now();

    fs.writeFile('./public/images/' + imgName + '.jpg', dataBuffer, function(err) {
        if(err){
            console.log(err);
            res.json({
                status: 500,
                msg: '内部服务器出错'
            });
        }else{
            console.log('保存图片成功');
            res.json({
                status: 200,
                msg: '保存图片成功',
                data: 'http://localhost:3000/public/images/' + imgName + '.jpg'
            });
        }
    });
});

module.exports = router;

