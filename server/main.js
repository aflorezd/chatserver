var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var messages = [{
  msg: "Hola soy un mensaje",
  user: "ChatServer",
}];

app.get('/hello', function(req, res) {
  res.status(200).send("Hello World!");
});

io.on('connection', function(socket) {
  console.log('conectado...');
  socket.username = `user-${new Date().getTime()}`;
  socket.emit('uchanged', {username: socket.username});

  socket.emit('messages', messages);

  socket.on('new-message', function(data) {

    messages.push({user: socket.username, msg: data.msg});
    io.sockets.emit('messages', messages);
  });

  socket.on('change-username', function(username){
    console.info('request change username => ', username);
    socket.username = username;

    socket.emit('uchanged', {username: username});
  });
});

server.listen(2500, "0.0.0.0", function() {
  console.log("Servidor en http://localhost:2500");
});
