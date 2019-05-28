module.exports = function(server) {
  const io = require('socket.io')(server)

  io.on('connection', function(socket) {
    console.log('有一个客户端连接了服务器!')
    socket.on('sendMsg', function(data) {
      console.log('服务器接受到客户端发送的消息', data)
      data.name = data.name.toUpperCase()
      io.emit('receiveMsg', data.name + '&' + data.date)
    })
  })
}