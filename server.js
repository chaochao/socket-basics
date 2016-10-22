var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  console.log('user connect vai socket io');
  socket.on('message', function(message) {
    console.log("message  received: " + message.text);
    //io.emit is for send to all including sender

    //send to all except sender
    socket.broadcast.emit('message', message);
  })
  socket.emit('message', {
    text: "server: Welcome this is only for test"
  });
});
http.listen(PORT, function() {
  console.log('Server start!');
})