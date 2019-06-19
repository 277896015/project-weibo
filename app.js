var express = require('express');
var path = require('path');
const moment = require('moment');
const mongoose = require("mongoose");
const bodyParse = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const md5 = require('md5');
var app = express();
app.locals.moment = moment;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParse()); //解析所有的post  数据存在 req.body
app.use(cookieParser('123456')); //引入cookieParser中间件
app.use(session({
    secret: "123456",
    name: "sessionId",
    cookie: { max: 60 * 1000 },
    rolling: true,
    store: new MongoStore({
        url: 'mongodb://localhost:27017/app' //指定session保存的数据库
    })
}));





//链接数据库
mongoose.connect('mongodb://localhost/app', { useNewUrlParser: true, useFindAndModify: false });
const con = mongoose.connection;
con.on('open', function() {
    console.log("数据库连接成功");
})

app.get('/loginout', function(req, res) {
    req.session.destroy(function(err) {
            if (err) throw err;
            console.log('退出成功');
        })
        //重定向登录
    res.redirect("/login");
})

app.use('/add', require('./routes/add'));
app.use('/product', require('./routes/product'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));



// error handler
app.use(function(err, req, res, next) {
    res.send('error');

});
app.listen(4000);
module.exports = app;