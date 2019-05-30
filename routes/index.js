var express = require('express');
const md5 = require('blueimp-md5')
var router = express.Router();

const { UserModel, chatModel } = require('../db/models')
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

router.post('/update', function(req, res) {
  const userid = req.cookies.userid
  if(!userid) {
    return res.send({code:1, msg: '请先登录'})
  }
  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid}, user, function(error, oldUserInfo) {
    if(!oldUserInfo) {
      res.clearCookie('userid') 
    } else {
      const {_id, userName, type} = oldUserInfo
      const data = Object.assign(user, {_id, userName, type})
      res.send({code: 0, data})
    }
  })
})

router.get('/user', function(req, res) {
  const userid = req.cookies.userid
  if(!userid) {
    return res.send({code:1, msg: '请先登录'})
  }
  UserModel.findOne({_id: userid}, filter, function(error, user) {
    res.send({code: 0, data: user})
  })
})

router.get('/userlist', function(req, res) {
  const { type } = req.query
  UserModel.find({type}, filter, function(error, users) {
    res.send({code: 0, data: users})
  })
})

router.get('./msglist', function(req, res) {
  const userid = req.cookies.userid
  UserModel.find(function(err, userDocs) {
    const users = userDocs.reduce((users, user)=> {
      users[user._id] = {userName: user.userName, avatar: user.avatar}
      return users
    }, {})

    chatModel.find({'$or': [{from: userid}, {to: userid}] }, filter, function(err, chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

router.post('/readmsg', function(req, res) {
  const from = req.body.from
  const to = req.cookie.userid

  chatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(err, doc) {
    console.log('./readmsg', doc)
    res.send({code: 0, data: doc.nModified})
  })
})

module.exports = router;
