const express = require('express');
const path = require('path');
const formidable = require('formidable');
const router = express.Router();
const product = require("../models/product");
const login = require('../middlewares/login'); //引入判断权限中间件
var arr = [];
var sessions = {};
var obj = {};

router.get("/", login, function(req, res) {
        res.render("add");
    })
    //可以调用多个函数
router.post('/', login, function(req, res) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, "../", "uploads");
    form.parse(req, function(err, fields, files) {
        if (err) throw err;
        //保存数据
        if (files.blogpicture.length) {
            obj = {
                ...fields,
                blogpicture: "/" + path.basename(files.blogpicture.path),
                touxiang: req.session.touxiang,
                nichen: req.session.nichen,
                username: req.session.username,
                userid: req.session.userid,
                createAt: Date.now()

            }
        } else {



            obj = {
                ...fields,
                blogpicture: "",
                touxiang: req.session.touxiang,
                nichen: req.session.nichen,
                username: req.session.username,
                userid: req.session.userid,
                createAt: Date.now()

            }
        }
        var productInstance = new product(obj); //集合的实例 一条数据
        // productIstance.save(); //保存数据
        productInstance.save();


        res.redirect('/add/list');


    })
})


router.get('/list', function(req, res) {
    //  console.log(arr)
    //获取数据

    // console.log(req.session);


    product.find({}, function(err, results) {
        if (err) throw err;


        res.render('index', {
            arr: results,
            sessions: req.session,
        });
        // res.render('list', { arr: results });
    })

})

module.exports = router;