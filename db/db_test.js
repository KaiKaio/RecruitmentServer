// 测试mongoose 操作 mongoDB
const md5 = require('blueimp-md5')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/recruitmentserver', { useNewUrlParser: true })
const conn = mongoose.connection
conn.on('connected', function() {
  console.log('数据库连接成功,YE!!')
})

// 文档（对象）约束
const userSchema = mongoose.Schema({
  userName: { type: String, require: true },
  password: { type: String, require: true },
  type: { type: String, require: true },
  avatar: { type: String }
})

// 集合名称
const UserModel = mongoose.model('users', userSchema)

function testSave() {
  // 创建UserModel实例
  const userModel = new UserModel({userName: 'Kai', password: md5('123'), type: 'personnel'})
  // 保存
  userModel.save(function(error, user) {
    console.log('save()', error, user)
  })
}

function testFind() {
  UserModel.find(function(error, users) { // 没有匹配为 []
    console.log('find()', error, users)
  })
  UserModel.findOne({_id:'5cdacc02318fe7e301589270'}, function(error, user) { // 没有匹配为 null
    console.log('findOne()', error, user)
  })
}

function testUpdate() {
  UserModel.findByIdAndUpdate({_id:'5cdacc02318fe7e301589270'}, {userName: 'KaiKaiYa'}, function(error, oldUser) {
    console.log('findByIdAndUpdate()', error, oldUser)
  })
}

function testDelete() {
  UserModel.remove({_id:'5cdacc02318fe7e301589270'}, function(error, olduser) {
    console.log('remove()', error, olduser)
  })
}
