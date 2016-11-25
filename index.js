var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectionCount = 0;
var nicknames_taken = [];

function serveHTML(req, res){
  res.sendFile(__dirname + '/index.html');
}

function serveAll(req, res){
  res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/stylesheet.css');
}

app.use(express.static('public'));

io.on('connection', function(socket){
  // manage connection count
  connectionCount++;
  console.log('a user connected', 'id: '+socket.id, 'total connections: '+connectionCount);
  socket.on('disconnect', function(){
    connectionCount--;
    console.log('user disconnected', 'id: '+socket.id, 'total connections: '+connectionCount);
  });
  // receive welcome with nickname, store in socket object
  socket.on('welcome', function(nickname){
    socket.nickname = nickname;
  });
  // broadcast incoming messages to all sockets and log to console
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message from '+socket.id+': '+msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});