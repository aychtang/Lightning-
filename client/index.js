(function() {
	var socket = io.connect();
	var context = document.getElementById('canvas').getContext('2d');
	context.canvas.width = 600;
	context.canvas.height = 600;
	var name = prompt('enter your name');
	if (name) {
		socket.emit('playerName', name);
	}

	$('canvas').mousemove(function(e) {
		socket.emit('updatePosition', {x: e.offsetX, y: e.offsetY});
	});

	socket.on('newPos', function(data) {
		context.clearRect(0,0,600,600);
		for (var player in data) {
			context.fillRect(data[player].x, data[player].y, 15, 15);
			context.fillText(data[player].name, data[player].x, data[player].y + 25);
		}
	});

}())