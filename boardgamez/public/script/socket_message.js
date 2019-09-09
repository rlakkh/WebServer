var socket = io();
$('#chat').on('submit', function(e){
  socket.emit('send message_main', $('#name').val(), $('#message').val());
  $('#message').val("");
  $("#message").focus();
  e.preventDefault();
});
socket.on('receive message_main', function(msg){
  $('#chatLog').append(msg+"\n");
  $('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
});
socket.on('change name', function(name){
  $('#name').val(name);
});