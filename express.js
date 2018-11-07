let mysql = require("mysql");
const express = require('express')
const bodyParser = require('body-parser');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
const app = express()

app.use(bodyParser.urlencoded({extended: true})) 
app.use(bodyParser.json())
app.use(allowCrossDomain)

const connect = mysql.createConnection({
    host:"114.116.150.28",
    user:"root",
    password:"Guo114092+-+",
    // port:"3306",
    database:"gyang" 
});
//开始链接数据库
connect.connect(function(err){
    if(err){
        console.log(`mysql连接失败: ${err}!`);
    }else{
        console.log("mysql连接成功!");
    }
});
//获取user
app.get('/api/userlist', (req, res) => {
    const sql = `select * from users limit ${req.query.skip * req.query.limit}, ${req.query.skip * req.query.limit + req.query.limit}`;
    const sqlcount = `select count(*) from users`;
    connect.query(sql, (err, result) => {
        if (err) throw err;
        connect.query(sqlcount, (err, count) => {
            if (err) throw err;
            res.json({
                code: 200,
                count: count[0]['count(*)'],
                data: result
            })
        })
    })
})
//添加user
app.post('/api/adduser', (req, res) => {
    var  addSql = 'INSERT INTO users(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
    var  addSqlParams = [req.body.name, req.body.url,'23453', req.body.country];
    connect.query(addSql, addSqlParams, function(err,result){
        if(err){
        }else{
            res.json('添加成功')
        }
    })
})
//删除user
app.delete('/api/deluser', (req, res) => {
    var delSql = `DELETE FROM users where id=${req.body.id}`;
    connect.query(delSql,function (err, result) {
        if(err){
            return;
        } else {
            res.json('删除成功')
        }        
    });
})
//修改user
app.put('/api/putuser', (req, res) => {
    var delSql = `update users set name='${req.body.name}',url='${req.body.url}',country='${req.body.country}' where id=${req.body.id}`;
    console.log(delSql)
    connect.query(delSql,function (err, result) {
        if(err){
            return;
        } else {
            res.json('删除成功')
        }        
    });
})

//判断是否登录成功
app.post('/api/login', (req, res) => {
    console.log('delSql444')
    var delSql = `select * from users where name='${req.body.name}' and password='${req.body.password}'`;
    console.log(delSql)
    connect.query(delSql,function (err, result) {
        if(err){
            console.log(err)
            return;
        } else {
            console.log(result.length)
            if (result.length > 0) {
                res.json({
                    code: 200,
                    data: '登录成功'
                })
            } else {
                res.json({
                    code: 404,
                    data: '请检查用户名或密码'
                })
            }
            
        }        
    })
})
app.listen(3000, () => console.log('http://loaclhost:3000'))