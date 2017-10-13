var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);

server.listen(3000, function(){
  console.log('server started at port 3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname+"/index.html");
})

users = [];
clients = [];

io.sockets.on('connect', function(client){
  console.log('a user connected    < '+ client.id +' >');
  clients.push(client);
  client.on('login',function(data){
    users[data.name] = client;
    //console.log(users);
  })
  
  //receive message
  client.on('sendmsg', function(data){
    var sender = data.sender;
    var receiver = data.receiver;
    var msg = data.msg;
    if(users[receiver]){
      var receiverSocket = users[receiver];    
      receiverSocket.emit('recvmsg',{sender: sender, msg: msg});
    }
    else
      client.emit('recvmsg',{sender: 'error', msg: 'reciver not available'});
    //for(var i=0; i<cli)
    
    
  });
  
  //disconnect
  client.on('disconnect', function(data){
    console.log('a user disconnected < '+ client.id +' >');
    
  });
  
});
 