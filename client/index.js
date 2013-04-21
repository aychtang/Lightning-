(function(){
	var socket = io.connect();
	var context = document.getElementById('canvas').getContext('2d');
	var name = prompt('enter your name bitch');

	if (name) {
		socket.emit('playerName', name);
	}

	context.canvas.width = 600;
	context.canvas.height = 600;

	$('canvas').mousemove(function(e){
		if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
		socket.emit('updatePosition', {x: mouseX, y: mouseY});
	});

	socket.on('newPos', function(data) {
		context.clearRect(0,0,600,600);
		for (var player in data) {
			context.fillRect(data[player].x, data[player].y, 15, 15);
			context.fillText(data[player].name, data[player].x, data[player].y + 25);
		}
	});
}())