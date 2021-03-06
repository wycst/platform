/*
skywalking 监控
先安装 npm install skywalking-nodejs --save
require('skywalking-nodejs').start({
    applicationCode: 'platform',
    directServers: 'localhost:11800'
});
*/

// node 后端服务器
const formRouter = require('./form/router');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("X-Powered-By",' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");
	console.log(' url : ' + req.url);
	next();
});

// 后端api路由
app.use('/form',formRouter);

// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');