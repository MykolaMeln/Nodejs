var mongoose = require('mongoose');
var log = require('./log')(module);

var config = require('./config');
mongoose.connect(config.get('mongoose:uri'),{ useUnifiedTopology: true,useNewUrlParser:true});
//mongoose.connect('mongodb://localhost/test1',{  useUnifiedTopology: true,useNewUrlParser:true});
var db = mongoose.connection;

db.on('error', function (err) {
log.error('connection error:', err.message);
});

db.once('open', function callback () {
console.log("Connected to DB!");
});

var Schema = mongoose.Schema;
/*
var Images = new Schema({
kind: {
type: String,
enum: ['thumbnail', 'detail'],
required: true },
url: { type: String, required: true }
});
/*
var Article = new Schema({
title: { type: String, required: true },
author: { type: String, required: true },
description: { type: String, required: true },
images: [Images],
modified: { type: Date, default: Date.now }
});*/
var Article = new Schema({
//title: { type: String, required: true },
author: { type: String, required: true }
//description: { type: String, required: true },
//modified: { type: Date, default: Date.now }
});
/*
Article.path('title').validate(function (v) {
  return v.length > 5 && v.length < 70;
});
*/
var ArticleModel = mongoose.model('Article', Article);
module.exports.ArticleModel = ArticleModel;
