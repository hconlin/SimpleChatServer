var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var numOfUsers = 0;
var messages = [];

io.on('connection', function(socket){
  //user connects
  console.log('a user connected');
  ++numOfUsers;

  //update number of users
  io.emit('user joined', numOfUsers);

  //get old messages
  socket.emit('get messages', JSON.stringify(messages));

  //socket gets a message
  socket.on('message', function(user, msg){
    //append message to messages object
    messages.push({user: user, msg: msg})
    //send message to all connected users
    io.emit('receivedMessage', user, msg);
  });

  //socket disconnects
  socket.on('disconnect', function(){
    console.log('user disconnected');
    --numOfUsers;

    //updates users after user leaves
    io.emit('user left', numOfUsers);
  });
});

http.listen(8900, function(){
  console.log('listening on port 8900');
});
