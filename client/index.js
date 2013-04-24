(function() {
	var socket = io.connect();
	var background = document.getElementById('background').getContext('2d');
	var foreground = document.getElementById('foreground').getContext('2d');
	foreground.canvas.width = background.canvas.width = 600;
	foreground.canvas.height = background.canvas.height = 600;
	foreground.fillStyle = 'rgb(255,0,0)';
	var name = prompt('Enter your name');
	if (name) {
		socket.emit('playerName', name);
	}

//Sends this users x + y position to server
	$('#foreground').mousemove(function(e) {
		socket.emit('updatePosition', {x: e.offsetX, y: e.offsetY});
	});

//Draw function renders each players position and adds their name
	socket.on('newPosition', function(data) {
		foreground.clearRect(0, 0, 600, 600);

		for (var player in data) {
			var player = data[player];
			if (player.x !== null) {
				foreground.fillRect(player.x, player.y, 15, 15);
				foreground.fillText(player.name, player.x, player.y + 25);
			}
		}
	});

	socket.on('change', function(data) {
		var bgImage = new Image();
		bgImage.src = 'slides/' + data;
		bgImage.onload = function() {
			background.drawImage(bgImage, 0, 0);
		};
	});

}())