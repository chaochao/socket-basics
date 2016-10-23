var PORT = process.env.PORT || 3000;
var express = require('express');

var moment = require('moment');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

function sendCurrentUser(socket) {
  // BUG: each time when you refresh
  // the socket id will change and same user will be treated
  // as different person.
  if (typeof clientInfo[socket.id] !== 'undefined') {
    var user = [];
    var compareRoomName = clientInfo[socket.id].room;
    Object.keys(clientInfo).forEach(function(socketId) {
      var peopleInTheRoom = clientInfo[socketId]
      if (peopleInTheRoom.room === compareRoomName) {
        user.push(peopleInTheRoom.name);
      }
    });
    io.to(compareRoomName).emit('message', {
      name: 'System',
      text: 'currentUser: ' + user.join(', '),
      timeStamp: moment.valueOf()
    });
  }
}

io.on('connection', function(socket) {
  console.log('user connect via socket io');

  socket.on('disconnect', function() {
    var userInfo = clientInfo[socket.id]
    if (typeof userInfo !== 'undefined') {
      //leave the channel
      socket.leave(userInfo.room);
      //broadcast to other
      io.to(userInfo.room).emit('message', {
        name: 'System',
        text: userInfo.name + ' leave the room',
        timeStamp: moment.valueOf()
      });
    }
  });

  // emit to all clients in the room
  socket.on('message', function(message) {
    console.log("message  received: " + message.timeStamp + ' ' + message.text + 'from: ' + message.name);
    if (message.text === '@currentUser') {
      sendCurrentUser(socket);
    } else {
      //io.emit is for send to all including sender
      //send to al except sender
      io.to(clientInfo[socket.id].room).emit('message', message);
    }
  });
  // store data in clientInfo obj and send data xx is joined
  socket.on('joinRoom', function(loginInfo) {
    clientInfo[socket.id] = loginInfo;
    console.log(JSON.stringify(loginInfo));
    socket.join(loginInfo.room); // set as a group
    socket.broadcast.to(loginInfo.room).emit('message', {
      name: 'System',
      text: loginInfo.name + ' joined the room',
      timeStamp: moment().valueOf()
    });
  });

  var currentTime = moment().valueOf();

  socket.emit('message', {
    text: "Chat App",
    timeStamp: currentTime,
    name: 'System'
  });
});
http.listen(PORT, function() {
  console.log('Server start!');
})