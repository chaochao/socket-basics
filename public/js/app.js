var socket = io();

socket.on('connect', function() {
  console.log("yep I connected");
})

socket.on('message', function(message) {
  console.log('this is message from server: ' + message.text);
  var displayTime = moment.utc(message.timeStamp).local().format('H:mma');
  $('.message').append('<p>' + displayTime + ' <Strong>' + message.text + '<Strong><p>');
});


var $form = $('#message-form');
$form.on('submit', function(event) {
  event.preventDefault();
  var currentTime = moment().valueOf();
  var $message = $form.find('input[name=message]');
  socket.emit('message', {
    text: $message.val(),
    timeStamp: currentTime 
  });
  $message.val('');

});