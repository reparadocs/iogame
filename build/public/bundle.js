(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**************************************************
** GAME Bullet CLASS
**************************************************/
var Constants = require('./Constants').Constants;

var Bullet = function (startX, startY, startDir, size) {
  var x = startX,
      y = startY,
      dir = startDir,
      size = size,
      id;

  var setX = function (newX) {
    x = newX;
  };

  var setY = function (newY) {
    y = newY;
  };

  var setDir = function (newDir) {
    dir = newDir;
  };

  var getX = function () {
    return x;
  };

  var getY = function () {
    return y;
  };

  var getDir = function () {
    return dir;
  };

  var getSize = function () {
    return size;
  };

  var update = function () {
    x += dir[0] * Constants.bulletSpeed;
    y += dir[1] * Constants.bulletSpeed;
  };

  var draw = function (ctx) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  };

  return {
    update: update,
    draw: draw,
    setX: setX,
    setY: setY,
    setDir: setDir,
    getX: getX,
    getY: getY,
    getDir: getDir,
    getSize: getSize
  };
};

exports.Bullet = Bullet;
},{"./Constants":3}],2:[function(require,module,exports){

/**************************************************
** Collisions Class
**************************************************/
var Collisions = function () {
  var hasCollided = function (obj1, obj2, obj2XSize, obj2YSize) {
    if (inBounds(obj1, obj2, obj2XSize, obj2YSize)) {
      return true;
    }
    return false;
  };

  var inBounds = function (obj1, obj2, obj2XSize, obj2YSize) {
    if (obj1.getX() > obj2.getX() - obj2XSize / 2 && obj1.getX() < obj2.getX() + obj2XSize / 2 && obj1.getY() > obj2.getY() - obj2YSize / 2 && obj1.getY() < obj2.getY() + obj2YSize / 2) {
      return true;
    }
    return false;
  };

  return {
    hasCollided: hasCollided
  };
};

exports.Collisions = Collisions;
},{}],3:[function(require,module,exports){
var Constants = {
  gameHeight: 200,
  gameWidth: 200,

  borderSize: 2,

  playerSpeed: 3,
  playerSize: 10,

  bulletSize: 2,
  bulletSpeed: 5,
  bulletDelay: 200,
  bulletMaxSize: 40,
  bulletGrowthRate: 0.2,

  resourceSize: 2,
  numResources: 20
};

exports.Constants = Constants;
},{}],4:[function(require,module,exports){

/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function () {
	var up = up || false,
	    left = left || false,
	    right = right || false,
	    down = down || false,
	    space = space || false;

	var onKeyDown = function (e) {
		var that = this,
		    c = e.keyCode;
		switch (c) {
			// Controls
			case 32:
				that.space = true;
				break;
			case 37:
				// Left
				that.left = true;
				break;
			case 38:
				// Up
				that.up = true;
				break;
			case 39:
				// Right
				that.right = true; // Will take priority over the left key
				break;
			case 40:
				// Down
				that.down = true;
				break;
		};
	};

	var onKeyUp = function (e) {
		var that = this,
		    c = e.keyCode;
		switch (c) {
			case 32:
				that.space = false;
				break;
			case 37:
				// Left
				that.left = false;
				break;
			case 38:
				// Up
				that.up = false;
				break;
			case 39:
				// Right
				that.right = false;
				break;
			case 40:
				// Down
				that.down = false;
				break;
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		space: space,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};

exports.Keys = Keys;
},{}],5:[function(require,module,exports){

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;

var Player = function (startX, startY, color) {
	var x = startX,
	    y = startY,
	    dir = [1, 0],
	    color = color,
	    isShooting = false,
	    currentBulletSize = 0,
	    id;

	var setX = function (newX) {
		x = newX;
	};

	var setY = function (newY) {
		y = newY;
	};

	var setDir = function (newDir) {
		dir = newDir;
	};

	var getX = function () {
		return x;
	};

	var getY = function () {
		return y;
	};

	var getDir = function () {
		return dir;
	};

	var getColor = function () {
		return color;
	};

	var update = function (keys) {
		var prevX = x,
		    prevY = y;

		if (!keys.space && isShooting) {
			isShooting = false;
			var rtn = { command: "player shoots", x: x, y: y, dir: dir, size: currentBulletSize };
			currentBulletSize = 0;
			return rtn;
		}

		if (keys.space) {
			isShooting = true;
			if (currentBulletSize < Constants.bulletMaxSize) {
				currentBulletSize += Constants.bulletGrowthRate;
			}
		} else {
			if (keys.up) {
				dir = [0, -1];
			}
			if (keys.down) {
				dir = [0, 1];
			};
			if (keys.left) {
				dir = [-1, 0];
			}
			if (keys.right) {
				dir = [1, 0];
			};

			x = x + dir[0] * Constants.playerSpeed;
			y = y + dir[1] * Constants.playerSpeed;

			if (prevX != x || prevY != y) {
				return { command: "move player", x: x, y: y, dir: dir };
			}
		}

		return null;
	};

	var draw = function (ctx) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, Constants.playerSize, 0, 2 * Math.PI);
		ctx.fill();
	};

	return {
		update: update,
		draw: draw,
		setX: setX,
		setY: setY,
		setDir: setDir,
		getX: getX,
		getY: getY,
		getDir: getDir,
		getColor: getColor,
		id: id
	};
};

exports.Player = Player;
},{"./Constants":3}],6:[function(require,module,exports){

/**************************************************
** GAME Resouce CLASS
**************************************************/
var Constants = require('./Constants').Constants;

var Resource = function (startX, startY) {
  var x = startX,
      y = startY,
      id;

  var getX = function () {
    return x;
  };

  var getY = function () {
    return y;
  };

  var update = function () {};

  var draw = function (ctx) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, Constants.resourceSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  return {
    update: update,
    draw: draw,
    getX: getX,
    getY: getY
  };
};

exports.Resource = Resource;
},{"./Constants":3}],7:[function(require,module,exports){
var Bullet = require('./Bullet').Bullet;
var Constants = require('./Constants').Constants;
var Player = require('./Player').Player;
var Resource = require('./Resource').Resource;
var Keys = require('./Keys').Keys;
var Collisions = require('./Collisions').Collisions;
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

	// Initialise the local player
	localPlayer = new Player(startX, startY, '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6));
	if (location.hostname === "localhost") {
		socket = io.connect("http://localhost:3000");
	} else {
		socket = io.connect("https://testiogame.herokuapp.com");
	}
	remotePlayers = [];
	bullets = [];
	Collisions = new Collisions();
	resources = [];
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
	update();
	draw();

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
			if (Collisions.hasCollided(currentPlayer, currentBullet, Constants.playerSize, Constants.playerSize)) {
				console.log("A player has been hit!");
				remotePlayers.splice(j, 1);
			}
		}

		if (Collisions.hasCollided(localPlayer, currentBullet, Constants.playerSize, Constants.playerSize)) {
			console.log("Local player has been hit");
		}
	}
	for (var i = 0; i < resources.length; i++) {
		resources[i].update();
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

init();
animate();
},{"./Bullet":1,"./Collisions":2,"./Constants":3,"./Keys":4,"./Player":5,"./Resource":6,"./requestAnimationFrame":8}],8:[function(require,module,exports){
// shim layer with setTimeout fallback
window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function ( /* function */callback, /* DOMElement */element) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

exports.requestAnimFrame = window.requestAnimFrame;
},{}]},{},[7]);
