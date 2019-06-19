const express = require('express');
const router = express.Router();
//const path = require('path');
const md5 = require('md5');
const user = require("../models/user");
const formidable = require('formidable');
//const login = require('../middlewares/login'); //引入判断权限中间件
var arr = [];

router.get("/", function(req, res) {
    res.render("login");
})
router.post('/', function(req, res) {



        const form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            //查询数据
            /*  user.find({}, function(err, result) {
                if (err)  throw err;
                if (result.username==fields.username) {}

            })
*/
            user.find({
                username: fields.username,
                password: md5(fields.password),


            }, function(err, result) {
                if (err) throw err;

                if (result.length) { //匹配成功
                    // console.log(result[0]._id);

                    req.session.userid = result[0]._id;
                    // console.log(req.session._id);
                    req.session.username = result[0].username;
                    req.session.password = md5(result[0].password);
                    req.session.nichen = result[0].nichen;
                    req.session.sex = result[0].sex;
                    req.session.city = result[0].city;
                    req.session.QQ = result[0].QQ;
                    req.session.email = result[0].email;
                    req.session.birthday = result[0].birthday;
                    req.session.jianjie = result[0].jianjie;
                    req.session.touxiang = result[0].touxiang;
                    console.log("登陆成功");
                    res.redirect('/add/list');

                } else { //匹配不成功重定向到登录
                    console.log("密码错误或用户名不存在");
                    res.render('login');

                }
            })


        })
    })
    /*
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

*/


/*

    user.find({
        username: req.body.username,
        password: md5(fields.password)
    }, function(err, result) {
        if (err) throw err;
        if (result.length) { //匹配成功
            req.session.username = req.body.username;
            req.session.password = md5(fields.password);
            res.redirect('/add/list');
        } else { //匹配不成功重定向到登录
            console.log("密码错误或用户名不存在");
            res.render('login');

        }
    })*/


module.exports = router;