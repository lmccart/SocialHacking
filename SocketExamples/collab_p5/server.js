// Explained in tutorial here: http://socket.io/get-started/chat/
// 1. Install socket.io module: "npm install socket.io"
// 2. Install express module: "npm install express"

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('position', function(msg){
    // console.log('position x: ' + msg.x + ' y: ' + msg.y);
    //io.emit('position', msg);
    socket.broadcast.emit('position', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});


