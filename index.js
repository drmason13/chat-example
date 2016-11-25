var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connectionCount = 0;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
