var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectionCount = 0;
var nicknames_taken = [];

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

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on port '+port);
});
