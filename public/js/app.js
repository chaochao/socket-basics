var socket = io();

socket.on('connect',function(){
  console.log("yep I connected");
})

socket.on('message',function(message){
  console.log('this is message from server: '+ message.text);
})