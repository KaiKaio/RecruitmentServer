var express = require('express');
const md5 = require('blueimp-md5')
var router = express.Router();

const { UserModel } = require('../db/models')
const filter = {password: 0, __v: 0} // 指定过滤属性

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
  const { userName, password, type } = req.body
  UserModel.findOne({ userName }, function(error, user) {
    if(user) {
      res.send({code: 1, msg: '此用户已存在'})
    } else {
      new UserModel({ userName, type, password: md5(password) }).save(function(error, user) {
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
        const data = { userName, type, _id: user._id }
        res.send({code: 0, data: data})
      })
    }
  })
})

router.post('/login', function(req, res) {
  const { userName, password } = req.body
  UserModel.findOne({ userName, password: md5(password) }, filter, function(error, user) {
    if(!user) {
      res.send({code: 1, msg: '用户名或密码错误'})
    } else {
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
      res.send({code: 0, data: user})
    }
  })
})

module.exports = router;
