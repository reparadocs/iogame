var Bullet = require('./Bullet').Bullet;
var Constants = require('./Constants').Constants;
var Player = require('./ClientPlayer').ClientPlayer;
var Resource = require('./Resource').Resource;
var Keys = require('./Keys').Keys;
var GameObject = require('./GameObject').GameObject;
var Commands = require('./Commands').Commands;
var requestAnimFrame = require('./requestAnimationFrame').requestAnimFrame;
var Globals = require('./Globals').Globals;

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx: Object,			// Canvas rendering context
	keys: Key,			// Keyboard input
	localPlayer: Player, // Local player,
	remotePlayers: Array<Object>, // Remote players
	bullets: Array<Object>,
	resources: Array<Object>,
	borders: Array<Object>,
	socket: Object,
	lastTime: number,
	frame: number;

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

	Globals.widthRatio = window.innerWidth / Constants.gameWidth;
	Globals.heightRatio = window.innerHeight / Constants.gameHeight;

	localPlayer = new Player(0, 0, [], '', null, createBullet);
	localPlayer.reset();

	if (location.hostname === "localhost") {
		socket = io.connect("http://localhost:3000");
	} else {
		socket = io.connect("https://testiogame.herokuapp.com")
	}

	// Initialise keyboard controls
	keys = new Keys(localPlayer, socket);

	remotePlayers = [];
	bullets = [];
	resources = [];
	borders = [new GameObject(Constants.borderSize / 2, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight, '#000'),
		new GameObject(Constants.gameWidth / 2, Constants.borderSize / 2, Constants.gameWidth, Constants.borderSize,  '#000'),
		new GameObject(Constants.gameWidth, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight,  '#000'),
		new GameObject(Constants.gameWidth / 2, Constants.gameHeight, Constants.gameWidth, Constants.borderSize,  '#000')];
	ready = false;

	// Start listening for events
	setEventHandlers();
	lastTime = Date.now();
	frame = 0;
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);
	window.addEventListener("mousemove", onMouseMove, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
	socket.on("connect", onSocketConnected);
	socket.on("disconnect", onSocketDisconnect);
	socket.on("new player", onNewPlayer);
	socket.on("change player direction", onChangePlayerDirection);
	socket.on("remove player", onRemovePlayer);
	socket.on("player charges shot", onChargeShot)
	socket.on("player shoots", onShoot);
	socket.on("resource spawned", onResourceSpawned);
	socket.on("update", onUpdateState);
	socket.on("death", onDeath);
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

function onMouseMove(e) {
	if (localPlayer) {
		keys.onMouseMove(e);
	}
}

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {
			x: localPlayer.getX(),
			y: localPlayer.getY(),
			dir: localPlayer.getDir(),
			color: localPlayer.getColor(),
			name: localPlayer.getName(),
		});
		localPlayer.id = socket.io.engine.id;
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
  console.log("New player connected: "+data.id);
  var newPlayer = new Player(data.x, data.y, data.dir, data.color, data.name, createBullet);
  newPlayer.id = data.id;
  remotePlayers.push(newPlayer);
};

function onChangePlayerDirection(data) {
	var player = playerById(data.id);
	if (!player) {
		if (localPlayer.id === data.id) {
			player = localPlayer;
		} else {
			console.log("Player not found: "+data.id)
			return;
		}
	};
	Commands.changeDir(player, data.xDir, data.yDir);
	player.synchronize(data);
}

function onRemovePlayer(data) {
	console.log("player disconnect");
  var removePlayer = playerById(data.id);

  if (!removePlayer) {
    console.log("Player not found: " + data.id);
    return;
  }

  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onChargeShot(data: Object) {
	var player = playerById(data.id);
	if (!player) {
			console.log("Player not found: "+data.id);
			return;
	};
	Commands.chargeShot(player, data.time);
	player.synchronize(data);
}

function onShoot(data: Object) {
	var player = playerById(data.id);
	if (!player) {
			console.log("Player not found: "+data.id);
			return;
	};
	Commands.shoot(player, data.time);
	player.synchronize(data);
}

function onResourceSpawned(data: Object) {
	var newResource = new Resource(data.x, data.y);
	resources.push(newResource);
}

function onDeath(data: Object) {
	var player = playerById(data.id);
	if (!player) {
			if (localPlayer.id === data.id) {
				player = localPlayer;
			} else {
				console.log("Player not found: "+data.id)
				return;
			}
	};
	player.reset(data.color);
	player.synchronize(data);
}

function onUpdateState(data: Object) {
	var player = playerById(data.id);
	if (!player) {
			if (localPlayer.id === data.id) {
				player = localPlayer;
			} else {
				console.log("Player not found: "+data.id)
				return;
			}
	};
	player.synchronize(data);
}

function playerById(id: String) {
  var i;
  for (i = 0; i < remotePlayers.length; i++) {
    if (remotePlayers[i].id == id)
      return remotePlayers[i];
  };
  return false;
};

function createBullet(
	x: number,
	y: number,
	dir: Array<number>,
	size: number,
	owner: Object,
) {
	bullets.push(new Bullet(x, y, dir, size, owner));
}

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	var framesToRun = Math.floor((Date.now() - lastTime) / (1000 / 60));
	for (var i = 0; i < framesToRun; i++) {
		frame += 1;
		update();
		draw();
	}
	lastTime += framesToRun * (1000 / 60);
	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	Globals.widthRatio = window.innerWidth / Constants.gameWidth;
	Globals.heightRatio = window.innerHeight / Constants.gameHeight;

	keys.update();
	localPlayer.update(borders, resources);

	for (var i = 0; i < remotePlayers.length; i++) {
		remotePlayers[i].update(borders, resources);
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
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = Constants.color_pink;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = Constants.color_dark_pink;
	ctx.fillRect(
		0 + Constants.borderSize,
		canvas.height - 72,
		300,
		72 - Constants.borderSize,
	);
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

	ctx.fillStyle = Constants.color_black;
	ctx.font = Constants.font_size_user_stats;
	ctx.fillText("Name: " + localPlayer.getName(), 10, canvas.height - 50);
	ctx.fillText("Shots: " + localPlayer.getBulletCount(), 10, canvas.height - 30);
	ctx.fillText("Score: " + localPlayer.getScore(), 10, canvas.height - 10);

	var clonedRemote = remotePlayers.slice(0);
	clonedRemote.push(localPlayer);
	clonedRemote.sort(function(a, b) {
    return b._score - a._score;
	});

	ctx.font = Constants.font_size_scoreboard;
	for (i = 0; i < (clonedRemote.length > 5 ? 5 : clonedRemote.length); i++) {
		ctx.fillText(
			clonedRemote[i]._name + ": " + clonedRemote[i]._score,
			10,
			30 + (i * 30),
		);
	}
};

/**************************************************
** LOADING SCREEN DRAW
**************************************************/
function drawLoading() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, Constants.borderSize, window.innerHeight - 200);
	ctx.fillRect(0, 0, window.innerWidth, Constants.borderSize);
	ctx.fillRect(0, window.innerHeight, window.innerWidth, Constants.borderSize);
	ctx.fillRect(window.innerWidth, 0, Constants.borderSize, window.innerHeight);

	ctx.font = "36px serif";
  ctx.fillText("Welcome to Dodgeball! Press Space to start", 10, 50);
};

init();
animate();
