const PORT = process.env.PORT ||4000

const io = require('socket.io')(PORT, {
  cors: {
    origin: ['https://bingoonline.netlify.app/'],
  },
})
io.on('connection', (socket) => {
  socket.on('snd-msg', (message, room) => {
    // console.log(message, room)
    socket.to(room).emit('res-msg', message)
  })
  socket.on('join-room', (room, cb) => {
    let clientno = 0
    if (!io.sockets.adapter.rooms.get(room)) {
      clientno = 0
    } else {
      clientno = io.sockets.adapter.rooms.get(room).size + 1
    }

    if (clientno <= 2) {
      socket.join(room)
      cb(`joined room  ${room}`, clientno)
      if (clientno === 2) {
        socket.to(room).emit('res-msg', -1, true)
      }
    } else {
      cb(`room full ${room}`, clientno)
    }
  })
  socket.on('leave-room', (room) => {
    socket.leave(room)
  })
})
