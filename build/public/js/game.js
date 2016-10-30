var Bullet = require('./Bullet').Bullet;
var Constants = require('./Constants').Constants;
var Player = require('./Player').Player;
var Resource = require('./Resource').Resource;
var Keys = require('./Keys').Keys;
var Collisions = require('./Collisions').Collisions();
var requestAnimFrame = require('./requestAnimationFrame').requestAnimFrame;

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas, // Canvas DOM element
ctx, // Canvas rendering context
keys, // Keyboard input
localPlayer, // Local player
remotePlayers, bullets, resources, socket;

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

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random() * (Constants.gameWidth - 5)),
	    startY = Math.round(Math.random() * (Constants.gameHeight - 5));

	localPlayer = new Player(startX, startY, '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6));

	if (location.hostname === "localhost") {
		socket = io.connect("http://localhost:3000");
	} else {
		socket = io.connect("https://testiogame.herokuapp.com");
	}
	remotePlayers = [];
	bullets = [];
	resources = [];
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
	socket.on("move player", onMovePlayer);
	socket.on("remove player", onRemovePlayer);
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
	var newPlayer = new Player(data.x, data.y, data.color);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	if (!movePlayer) {
		console.log("Player not found: " + data.id);
		return;
	};

	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setDir(data.dir);
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

function onShoot(data) {
	var newBullet = new Bullet(data.x, data.y, data.dir, data.size);
	bullets.push(newBullet);
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

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	if (!ready) {
		drawLoading();
		if (keys.space) {
			ready = true;
			// Initialise the local player
			var startX = Math.round(Math.random() * (Constants.gameWidth - 5)),
			    startY = Math.round(Math.random() * (Constants.gameHeight - 5));
			localPlayer.setX(startX);
			localPlayer.setY(startY);
		}
	} else {
		update();
		draw();
	}

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};

/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	state = localPlayer.update(keys);
	if (state !== null) {
		socket.emit(state.command, state);
	};

	for (var i = 0; i < bullets.length; i++) {
		currentBullet = bullets[i];
		currentBullet.update();
		for (var j = 0; j < remotePlayers.length; j++) {
			currentPlayer = remotePlayers[j];
			if (Collisions.hasCollided(currentPlayer, currentBullet, Constants.playerSize, Constants.playerSize, currentBullet.getSize(), currentBullet.getSize())) {
				console.log("A player has been hit!");
				remotePlayers.splice(j, 1);
				bullets.splice(i, 1);
			}
		}

		if (Collisions.hasCollided(localPlayer, currentBullet, Constants.playerSize, Constants.playerSize, currentBullet.getSize(), currentBullet.getSize())) {
			console.log("You have been killed!");
			ready = false;
		}

		if (Collisions.hasHitBoundary(currentBullet.getX(), currentBullet.getY(), currentBullet.getDir(), Constants.bulletSpeed, Constants.bulletSize)) {
			bullets.splice(i, 1);
		}
	}
	for (var i = 0; i < resources.length; i++) {
		var currentResource = resources[i];
		currentResource.update();
		if (Collisions.hasCollided(localPlayer, currentResource, Constants.playerSize, Constants.playerSize, Constants.resourceSize, Constants.resourceSize)) {
			console.log("You have picked up a resource!");
			resources.splice(i, 1);
			localPlayer.setCurrentBulletCount(localPlayer.getCurrentBulletCount() + 1);
		}
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

	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, Constants.borderSize, Constants.gameHeight);
	ctx.fillRect(0, 0, Constants.gameWidth, Constants.borderSize);
	ctx.fillRect(0, Constants.gameHeight, Constants.gameWidth, Constants.borderSize);
	ctx.fillRect(Constants.gameWidth, 0, Constants.borderSize, Constants.gameHeight);
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