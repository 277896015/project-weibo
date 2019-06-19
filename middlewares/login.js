//判断登录权限
const user = require("../models/user");
const path = require('path');
const product = require("../models/product");
module.exports = function(req, res, next) {

    //cookie
    /*  if (req.cookies.username && req.signedCookies.password) {
          //登录成功
          next();

      } else {
          //没有成功重定向
          res.redirect("/login");

      }*/
    //session



    if (req.session.username && req.session.password) {

        next();

    } else {
        //没有成功重定向
        res.redirect("/login");

    }
}