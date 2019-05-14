var express = require('express');
const md5 = require('blueimp-md5')
var router = express.Router();

const UserModel = require('../db/models').UserModel
// const { UserModel } = require('../db/models')

/* GET home page. */
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

module.exports = router;
