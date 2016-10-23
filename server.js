var PORT = process.env.PORT || 3000;
var express = require('express');

var moment = require('moment');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
  console.log('user connect via socket io');
  // emit to all clients in the room
  socket.on('message', function(message) {
    console.log("message  received: " + message.timeStamp + ' ' + message.text + 'from: ' + message.name);
    //io.emit is for send to all including sender
    //send to al except sender
    io.to(clientInfo[socket.id].room).emit('message', message);
  });
  // store data in clientInfo obj and send data xx is joined
  socket.on('joinRoom', function(loginInfo) {
    clientInfo[socket.id] = loginInfo;
    console.log(JSON.stringify(loginInfo));
    socket.join(loginInfo.room); // set as a group
    socket.broadcast.to(loginInfo.room).emit('message', {
      name: 'System',
      text: loginInfo.name + 'joined the room',
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