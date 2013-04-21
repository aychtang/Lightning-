var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080);

app.use(express.static(__dirname + '/../client'));

var players = {};

var player = function(socket) {
	return {
		id : socket.id,
    name: null,
		x : null,
		y : null
	};
};

var slides = ['Blank-World-Vector-Map.jpg'];
var currentSlide = '';

setInterval(function() {
  currentSlide = slides[~~(Math.random() * slides.length)];
  io.sockets.emit('change', currentSlide);
}, 5000);

io.sockets.on('connection', function(socket) {
	players[socket.id] = player(socket);

//Pushes game state upon mose move
  socket.on('updatePosition', function(data) {
  	players[socket.id].x = data.x;
  	players[socket.id].y = data.y;
  	io.sockets.emit('newPos', players);
  });

//Adds name to storage when received from client
  socket.on('playerName', function(data) {
    players[socket.id].name = data;
  });

  socket.on('disconnect', function() {
  	delete players[socket.id];
  });

});
