//定义上传商品字段
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    username: String,
    nichen: String,
    userid: String,
    touxiang: String,
    blogpicture: String,
    blogtext: String,
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: new Date() },
    zan: { type: Number, default: 0 },
    pinglun: Array

});
const product = mongoose.model("product", productSchema);
module.exports = product;