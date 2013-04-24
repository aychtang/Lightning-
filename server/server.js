var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {log: false});
server.listen(8080);

app.use(express.static(__dirname + '/../client'));

var players = {};

var player = function(socket) {
	return {
    name: null,
		x : null,
		y : null
	};
};

var slides = ['Blank-World-Vector-Map.jpg', '2.jpg'];
var currentSlide = '';

//Selects random slide and sends to clients every 5s
setInterval(function() {
  currentSlide = slides[~~(Math.random() * slides.length)];
  io.sockets.emit('change', currentSlide);
}, 5000);

//Pushes game state every 20 ms if anyone is connected
//todo: only push state that has changed
setInterval(function() {
  if (Object.keys(players).length > 0) {
    io.sockets.emit('newPosition', players);
  }
}, 20);

io.sockets.on('connection', function(socket) {
	var self = players[socket.id] = player(socket);
  socket.emit('change', currentSlide);

//Updates game state upon mouse move
  socket.on('updatePosition', function(data) {
  	self.x = data.x;
  	self.y = data.y;
  });

//Adds name to storage when received from client
  socket.on('playerName', function(data) {
    self.name = data;
  });

  socket.on('disconnect', function() {
  	delete players[socket.id];
  });

});
