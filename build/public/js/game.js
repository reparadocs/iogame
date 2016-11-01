var Bullet = require('./Bullet').Bullet;
var Constants = require('./Constants').Constants;
var Player = require('./Player').Player;
var Resource = require('./Resource').Resource;
var Keys = require('./Keys').Keys;
var GameObject = require('./GameObject').GameObject;
var Commands = require('./Commands').Commands;
var requestAnimFrame = require('./requestAnimationFrame').requestAnimFrame;

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas, // Canvas DOM element
ctx, // Canvas rendering context
keys, // Keyboard input
localPlayer, // Local player,
remotePlayers, // Remote players
bullets, resources, borders, socket;

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random() * (Constants.gameWidth - 5)),
	    startY = Math.round(Math.random() * (Constants.gameHeight - 5));

	localPlayer = new Player(startX, startY, '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6), createBullet);

	if (location.hostname === "localhost") {
		socket = io.connect("http://localhost:3000");
	} else {
		socket = io.connect("https://testiogame.herokuapp.com");
	}

	// Initialise keyboard controls
	keys = new Keys(localPlayer, socket);

	remotePlayers = [];
	bullets = [];
	resources = [];
	borders = [new GameObject(Constants.borderSize / 2, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight, '#000'), new GameObject(Constants.gameWidth / 2, Constants.borderSize / 2, Constants.gameWidth, Constants.borderSize, '#000'), new GameObject(Constants.gameWidth, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight, '#000'), new GameObject(Constants.gameWidth / 2, Constants.gameHeight, Constants.gameWidth, Constants.borderSize, '#000')];
	ready = false;

	// Start listening for events
	setEventHandlers();
};

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function () {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("change player direction", onChangePlayerDirection);
	socket.on("remove player", onRemovePlayer);
	socket.on("player charges shot", onChargeShot);
	socket.on("player shoots", onShoot);
	socket.on("resource spawned", onResourceSpawned);
};

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
	console.log("Connected to socket server");
	socket.emit("new player", { x: localPlayer.getX(), y: localPlayer.getY(), color: localPlayer.getColor() });
};

function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
	console.log("New player connected: " + data.id);
	var newPlayer = new Player(data.x, data.y, data.color, createBullet);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
};

function onChangePlayerDirection(data) {
	var player = playerById(data.id);
	if (!player) {
		console.log("Player not found: " + data.id);
		return;
	};
	Commands.changeDirection(player, data.xDir, data.yDir);
};

function onRemovePlayer(data) {
	console.log("player disconnect");
	var removePlayer = playerById(data.id);

	if (!removePlayer) {
		console.log("Player not found: " + data.id);
		return;
	}

	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onChargeShot(data) {
	var player = playerById(data.id);
	if (!player) {
		console.log("Player not found: " + data.id);
		return;
	};
	Commands.chargeShot(player, data.time);
}

function onShoot(data) {
	var player = playerById(data.id);
	if (!player) {
		console.log("Player not found: " + data.id);
		return;
	};
	Commands.shoot(player, data.time);
}

function onResourceSpawned(data) {
	var newResource = new Resource(data.x, data.y);
	resources.push(newResource);
}

function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id) return remotePlayers[i];
	};
	return false;
};

function createBullet(x, y, dir, size, id) {
	bullets.push(new Bullet(x, y, dir, size, id));
}

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};

/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	localPlayer.update(borders, resources);

	for (var i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].update(borders, resources);
		if (!remotePlayers[i].getAlive()) {
			remotePlayers.splice(i, 1);
		}
	}

	for (var i = 0; i < bullets.length; i++) {
		bullets[i].update(borders, localPlayer, remotePlayers);
		if (!bullets[i].getAlive()) {
			bullets.splice(i, 1);
		}
	}

	for (var i = 0; i < resources.length; i++) {
		if (!resources[i].getAlive()) {
			resources.splice(i, 1);
		}
	}

	if (!localPlayer.getAlive()) {
		ready = false;
		location.reload();
	}
};

/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the local player
	localPlayer.draw(ctx);

	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].draw(ctx);
	};

	for (i = 0; i < bullets.length; i++) {
		bullets[i].draw(ctx);
	}

	for (i = 0; i < resources.length; i++) {
		resources[i].draw(ctx);
	}
	for (i = 0; i < borders.length; i++) {
		borders[i].draw(ctx);
	}
};

/**************************************************
** LOADING SCREEN DRAW
**************************************************/
function drawLoading() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, Constants.borderSize, Constants.gameHeight);
	ctx.fillRect(0, 0, Constants.gameWidth, Constants.borderSize);
	ctx.fillRect(0, Constants.gameHeight, Constants.gameWidth, Constants.borderSize);
	ctx.fillRect(Constants.gameWidth, 0, Constants.borderSize, Constants.gameHeight);

	ctx.font = "36px serif";
	ctx.fillText("Welcome to Dodgeball! Press Space to start", 10, 50);
};

init();
animate();