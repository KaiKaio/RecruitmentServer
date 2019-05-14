// 包含 n 个操作数据库集合数据的 Model 模块
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/recruitmentserver', { useNewUrlParser: true })
const conn = mongoose.connection
conn.on('connected', function() {
  console.log('DB Connect Success!')
})

// 文档（对象）约束
const userSchema = mongoose.Schema({
  userName: { type: String, require: true },
  password: { type: String, require: true },
  type: { type: String, require: true },
  avatar: { type: String },
  post: { type: String },
  info: { type: String },
  company: { type: String },
  salary: { type: String },

})

// 集合名称
const UserModel = mongoose.model('users', userSchema)

exports.UserModel = UserModel