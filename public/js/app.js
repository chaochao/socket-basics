var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room') || 'public';

// update h1 tage
$('#room-title').text("Room: " + room);


socket.on('connect', function() {
  console.log("yep I connected");
  socket.emit('joinRoom', {
    name: name,
    room: room
  })
});


socket.on('message', function(message) {
  console.log('this is message from server: ' + message.text);
  var displayTime = moment.utc(message.timeStamp).local().format('H:mma');

  $('.message').append('<p><strong>' + message.name + ' ' + displayTime + '</strong></p>')
  $('.message').append('<p>' + message.text + '<p>');
});


var $form = $('#message-form');
$form.on('submit', function(event) {
  event.preventDefault();
  var currentTime = moment().valueOf();
  var $message = $form.find('input[name=message]');
  socket.emit('message', {
    text: $message.val(),
    timeStamp: currentTime,
    name: name
  });
  $message.val('');

});