(function(){
	var socket = io.connect();

	$('canvas').mousemove(function(e){
		if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
		socket.emit('updatePosition', {x: mouseX, y: mouseY});
	});

	socket.on('newPos', function(data) {
		var context = document.getElementById('canvas').getContext('2d');
		context.clearRect(0,0,500,500);
		for (var player in data) {
			context.fillRect(data[player].x, data[player].y, 5, 5);
		}
	})
}())