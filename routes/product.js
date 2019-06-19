const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const product = require("../models/product");



const login = require('../middlewares/login'); //引入判断权限中间件


router.get('/delete/:id', login, function(req, res) {
    // req.params.id
    //根据id查询数据库，然后删除此条数据

    product.findById(req.params.id, function(err, result) {
        if (err) throw err;

        console.log(req.session.userid);
        console.log(result.userid);

        if (result.userid == req.session.userid) { //匹配成功

            product.findByIdAndRemove(req.params.id, function(err) {
                if (err) throw err;
                console.log("删除成功");
                //删除图片
                if (result.blogpicture) {
                    //   req.query.img是<%=arr[i].blogpicture%>
                    fs.unlink(path.join(__dirname, "../", 'uploads', req.query.img), function(err) {

                        if (err) throw err;
                        console.log("图片删除成功")
                    });
                }
            })
            res.redirect('/add/list');

        } else {
            console.log("只能本人删除，请用" + result.nichen + " 的账号登录");

            res.render('login');

        }


    })
})
router.get('/zan/:id', function(req, res) {
    //console.log(req.params.id);
    product.findById(req.params.id, function(err, result) {
        if (err) throw err;
        var temp = result.zan;
        temp = ++temp;
        var obj = {
            zan: temp

        }
        product.findByIdAndUpdate(req.params.id, obj, function(err) {
            if (err) throw err;

            console.log("点赞成功");


        })
        res.redirect('/add/list')
    })
})

router.post('/pinglun', login, function(req, res) {

    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) throw err;
        console.log("获取到评论" + fields.pinglun)
            //  console.log(fields.productid)

        product.findById(fields.productid, function(err, result) {
            if (err) throw err;
            var pinglunobj = {
                pinglunid: new Date(),
                pinglunindex: fields.pinglun,
                pingluntouxiang: req.session.touxiang,
                pinglunren: req.session.nichen
            }

            console.log("查询到原评论数组" + result.pinglun);
            result.pinglun.push(pinglunobj);
            console.log("评论添加到数组" + result.pinglun);




            product.findByIdAndUpdate(fields.productid, {
                pinglun: result.pinglun

            }, function(err) {
                if (err) throw err;

                console.log("评论存入数据库成功");
                res.redirect('/add/list')
            })

        })
    })

})

router.get('/search', function(req, res) {
    //get请求
    //设置好 get 的为enctype="application/x-www-form-urlencoded"
    //application/x-www-form-urlencoded： 窗体数据被编码为名称/值对。这是标准的编码格式。
    //此时可用 req.query
    console.log(req.query.searchtext)

    //输入昵称模糊搜索微博
    // 利用正则表达式可以实现模糊搜索   nichen: new RegExp(fields.searchtext)
    product.find({
            $or: [ //多条件，数组形式  同时模糊搜索名字或博客内容
                { nichen: new RegExp(req.query.searchtext) },
                { blogtext: new RegExp(req.query.searchtext) }
            ]
        }, function(err, result) {
            if (err) throw err;
            if (result.length) { //匹配成功
                console.log("成功搜索+" + req.query.searchtext);
                res.render('index', {
                    arr: result,
                    sessions: req.session,
                });
            } else { //搜索不成功
                console.log("找不到任何匹配的微博")
                res.redirect('/add/list');
            }
        })
        // })
})

/*
router.post('/search', function(req, res) {
    //enctype="application/x-www-form-urlencoded"
    //application/x-www-form-urlencoded： 窗体数据被编码为名称/值对。这是标准的编码格式。
    //此时可用 req.body.search
    //输入昵称模糊搜索微博
    // 利用正则表达式可以实现模糊搜索   nichen: new RegExp(fields.searchtext)
    product.find({
            $or: [ //多条件，数组形式  同时模糊搜索名字或博客内容
                { nichen: new RegExp(req.body.searchtext) },
                { blogtext: new RegExp(req.body.searchtext) }
            ]
        }, function(err, result) {
            if (err) throw err;
            if (result.length) { //匹配成功
                console.log("成功搜索+" + req.body.searchtext);
                res.render('index', {
                    arr: result,
                    sessions: req.session,
                });
            } else { //搜索不成功
                console.log("找不到任何匹配的微博")
                res.redirect('/add/list');
            }
        })
        
})

*/

/*
//formidable解析数据
router.post('/search', function(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) throw err;
        //输入昵称模糊搜索微博
        // 利用正则表达式可以实现模糊搜索   nichen: new RegExp(fields.searchtext)
        product.find({
            $or: [ //多条件，数组形式  同时模糊搜索名字或博客内容
                { nichen: new RegExp(fields.searchtext) },
                { blogtext: new RegExp(fields.searchtext) }
            ]
        }, function(err, result) {
            if (err) throw err;
            if (result.length) { //匹配成功
                console.log("成功搜索");
                res.render('index', {
                    arr: result,
                    sessions: req.session,
                });
            } else { //搜索不成功
                console.log("找不到任何匹配的微博")
                res.redirect('/add/list');
            }
        })
    })
})
*/
router.get('/update/:id', login, function(req, res) {
    // req.params.id
    //根据id查询数据库
    product.findById(req.params.id, function(err, result) {
        if (err) throw err;
        //在回调函数里提供更新数据的页面 update.ejs
        //在回调函数里提供更新数据的页面 update.ejs
        console.log(req.session.userid);
        console.log(result.userid);

        if (result.userid == req.session.userid) { //匹配成功


            res.render("update", {
                data: result,
                sessions: req.session
            })

        } else {
            console.log("只能本人编辑，请用" + result.nichen + " 的账号登录");

            res.render('login');

        }


    })


})

router.post('/update/:id', login, function(req, res) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, "../", "uploads");
    form.parse(req, function(err, fields, files) {
        if (err) throw err;
        var obj = {
                ...fields,
                createAt: Date.now(),
                updateAt: new Date() //更新的时间段
            }
            //判断数据图片有没有更新
        if (files.blogpicture.name) {
            obj.blogpicture = "/" + path.basename(files.blogpicture.path);
        } else { //图片没有更新

        }
        product.findByIdAndUpdate(req.params.id, obj, function(err) {
            if (err) throw err;
            console.log("更新成功");
            res.redirect('/add/list')
        })
    })
})


module.exports = router;