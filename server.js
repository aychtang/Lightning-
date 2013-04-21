var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
  res.sendfile('./index.html');
});

app.get('/main.css', function(req, res){
  res.sendfile('./main.css');
});

app.get('/index.js', function(req, res){
  res.sendfile('./index.js');
});
	
server.listen(8080);

var players = {};

var player = function(socket) {
	return {
		id : socket.id,
		x : null,
		y : null
	};
};

io.sockets.on('connection', function (socket) {
	players[socket.id] = player(socket);
  socket.on('updatePosition', function (data) {
  	players[socket.id].x = data.x;
  	players[socket.id].y = data.y;
  	io.sockets.emit('newPos', players);
  });

  socket.on('disconnect', function() {
  	delete players[socket.id];
  });
});
