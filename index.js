const io = require('socket.io')(4000, {
  cors: {
    origin: ['http://localhost:3000'],
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
    const roomName = room
    const roomSockets = io.sockets.adapter.rooms.get(roomName)

    if (roomSockets) {
      const socketIds = Array.from(roomSockets)
      socketIds.forEach((socketId) => {
        const socket = io.sockets.sockets.get(socketId)
        if (socket) {
          socket.leave(roomName)
        }
      })
    }
  })
})
