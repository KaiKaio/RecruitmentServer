var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
  const { userName, password } = req.body
  if(userName === 'admin') {
    res.send({code: 1, msg: '此用户已存在'})
  } else {
    res.send({code: 0, data: {id: '1234', userName, password}})
  }
})

module.exports = router;
