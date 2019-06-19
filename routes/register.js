const express = require('express');
const router = express.Router();
const path = require('path');

const formidable = require('formidable');
const md5 = require('md5');
const user = require('../models/user');


router.get("/", function(req, res) {
    res.render("register");
})


router.post('/', function(req, res) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, "../", "uploads");
    form.parse(req, function(err, fields, files) {
        if (err) throw err;
        //保存数据

        var userInstance = new user({
            ...fields,
            touxiang: "/" + path.basename(files.touxiang.path),
            username: fields.username,
            password: md5(fields.password),

        }); //集合的实例 一条数据

        userInstance.save();
        console.log(userInstance.password);


        res.redirect('/login');

    })



    /*
        var userInstance = new user({
            username: req.body.username,
            password: md5(req.body.password)
        });
    */

    //扩展运算符，把类数组对象展开成一系列用逗号隔开的值
    //var userInstance = new user({...req.body });
    //集合的实例 一条数据
    //保存到数据库
    // userInstance.save();
    //  res.redirect('/login');
    /*
    //设置cookie
    //设置过期时间 毫秒
    res.cookie("username", req.body.username, { maxAge: 60 * 1000 });
    res.cookie("password", req.body.password, { maxAge: 60 * 1000, signed: true });
*/
    //使用session
    // req.session.username = req.body.username;
    // req.session.password = md5(req.body.password);
    //s%3A_mxGTqmj0Q8Hu-EbJf2Qvn58Vag_G8CU.odQt1kw1Ic3FZdbT5Z6FRiYZD8EazB1Dw5d8js0pMWc
    //值对应着sessionId 对象
})

module.exports = router;