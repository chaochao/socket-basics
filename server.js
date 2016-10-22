var PORT = process.env.PORT || 3000;
var express = require('express');

var moment = require('moment');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  console.log('user connect via socket io');



  socket.on('message', function(message) {
    console.log("message  received: " + message.timeStamp + ' ' + message.text);
    //io.emit is for send to all including sender
    //send to al except sender
    io.emit('message', message);
  })
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