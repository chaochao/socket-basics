var socket = io();

socket.on('connect', function() {
  console.log("yep I connected");
})

socket.on('message', function(message) {
  console.log('this is message from server: ' + message.text);

  $('.message').append('<p>'+message.text+'<p>');
});


var $form = $('#message-form');
$form.on('submit', function(event) {
  event.preventDefault();
  var $message = $form.find('input[name=message]');
  socket.emit('message', {
    text: $message.val()
  });
  $message.val('');

});