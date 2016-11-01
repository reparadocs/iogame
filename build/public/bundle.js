(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**************************************************
** GAME Bullet CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

class Bullet extends GameObject {

  constructor(startX, startY, startDir, size) {
    super(startX, startY, size, size, '#000');
    this._dir = startDir;
    this._size = size;
  }

  getSize() {
    return this._size;
  }

  getDir() {
    return this._dir;
  }

  update() {
    this._x += this._dir[0] * Constants.bulletSpeed;
    this._y += this._dir[1] * Constants.bulletSpeed;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.beginPath();
    ctx.arc(this._x, this._y, this._size, 0, 2 * Math.PI);
    ctx.fill();
  }
};

exports.Bullet = Bullet;
},{"./Constants":3,"./GameObject":4}],2:[function(require,module,exports){

/**************************************************
** Collisions Class
**************************************************/
var Constants = require('./Constants').Constants;

var Collisions = function () {
  var hasHitBoundary = function (x, y, dir, playerSpeed, size) {
    var x_pos = x + dir[0] * playerSpeed + size;
    var x_neg = x + dir[0] * playerSpeed - size;
    var y_pos = y + dir[1] * playerSpeed + size;
    var y_neg = y + dir[1] * playerSpeed - size;
    if (x_neg <= 0 || x_pos >= Constants.gameWidth || y_neg <= 0 || y_pos >= Constants.gameHeight) {
      return true;
    }
    return false;
  };

  var hasCollided = function (obj1, obj2, obj1XSize, obj1YSize, obj2XSize, obj2YSize) {
    if (inBounds(obj1, obj2, obj2XSize, obj2YSize) || inBounds(obj2, obj1, obj1XSize, obj1YSize)) {
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
    hasCollided: hasCollided,
    hasHitBoundary: hasHitBoundary
  };
};

exports.Collisions = Collisions;
},{"./Constants":3}],3:[function(require,module,exports){
var Constants = {
  gameHeight: 600,
  gameWidth: 1000,

  borderSize: 2,

  playerSpeed: 3,
  playerSize: 10,

  bulletSize: 2,
  bulletSpeed: 5,
  bulletDelay: 200,
  bulletMaxSize: 40,
  bulletGrowthRate: 0.2,

  resourceSize: 2,
  numResources: 100
};

exports.Constants = Constants;
},{}],4:[function(require,module,exports){

/**************************************************
** GAME GameObject CLASS
**************************************************/
class GameObject {

  constructor(startX, startY, width, height, color) {
    this._x = startX;
    this._y = startY;
    this._height = height;
    this._width = width;
    this._color = color;
  }

  getX() {
    return this._x;
  }

  getY() {
    return this._y;
  }

  setX(newX) {
    this._x = newX;
  }

  setY(newY) {
    this._y = newY;
  }

  getHeight() {
    return this._height;
  }

  getWidth() {
    return this._width;
  }

  collision(otherObj, x, y) {
    x = x || this._x;
    y = y || this._y;
    const diffX = Math.abs(x - otherObj.getX());
    const diffY = Math.abs(y - otherObj.getY());
    const distX = otherObj.getWidth() + this._width;
    const distY = otherObj.getHeight() + this._height;
    return diffX < distX && diffY < distY;
  }

  uncollide(otherObj) {
    const diffX = Math.abs(this._x - otherObj.getX());
    const diffY = Math.abs(this._y - otherObj.getY());
    const distX = otherObj.getWidth() + this._width;
    const distY = otherObj.getHeight() + this._height;
    const intrusionX = diffX - distX;
    const intrusionY = diffY - distY;
    if (intrusionX > intrusionY) {
      this._x = this._x > otherObj.getX() ? otherObj.getX() + distX : otherObj.getX() - distX;
    } else {
      this._y = this._y > otherObj.getY() ? otherObj.getY() + distY : otherObj.getY() - distY;
    }
  }

  draw(ctx) {
    ctx.fillStyle = this._color;
    ctx.fillRect(this._x - this._width / 2, this._y - this._height / 2, this._width, this._height);
  }
}

exports.GameObject = GameObject;
},{}],5:[function(require,module,exports){

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
},{}],6:[function(require,module,exports){

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var Collisions = require('./Collisions').Collisions();
var GameObject = require('./GameObject').GameObject;

class Player extends GameObject {

	constructor(startX, startY, color) {
		super(startX, startY, Constants.playerSize, Constants.playerSize, color);
		this._dir = [1, 0];
		this._isShooting = false;
		this._currentBulletSize = 0;
		this._bulletCount = 1;
	}

	getBulletCount() {
		return this._bulletCount;
	}

	setBulletCount(newBulletCount) {
		this._bulletCount = newBulletCount;
	}

	getDir() {
		return this._dir;
	}

	setDir(dir) {
		this._dir = dir;
	}

	getColor() {
		return this._color;
	}

	update(keys, borders) {
		var prevX = this._x,
		    prevY = this._y;

		if (!keys.space && this._isShooting) {
			this._isShooting = false;
			var rtn = {
				command: "player shoots",
				x: this._x,
				y: this._y,
				dir: this._dir,
				size: this._currentBulletSize
			};
			this._currentBulletSize = 0;
			this._bulletCount = this._bulletCount - 1;
			return rtn;
		}

		if (keys.space) {
			if (this._bulletCount > 0) {
				this._isShooting = true;
				if (this._currentBulletSize < Constants.bulletMaxSize) {
					this._currentBulletSize += Constants.bulletGrowthRate;
				}
			}
		} else {
			if (keys.up) {
				this._dir = [0, -1];
			}
			if (keys.down) {
				this._dir = [0, 1];
			};
			if (keys.left) {
				this._dir = [-1, 0];
			}
			if (keys.right) {
				this._dir = [1, 0];
			};
			let borderCollision = false;
			for (var i = 0; i < borders.length; i++) {
				if (this.collision(borders[i], this._x + this._dir[0] * Constants.playerSpeed, this._y + this._dir[1] * Constants.playerSpeed)) {
					borderCollision = true;
					break;
				}
			}
			if (!borderCollision) {
				this._x = this._x + this._dir[0] * Constants.playerSpeed;
				this._y = this._y + this._dir[1] * Constants.playerSpeed;
			}

			if (prevX != this._x || prevY != this._y) {
				return { command: "move player", x: this._x, y: this._y, dir: this._dir };
			}
		}

		return null;
	}

	draw(ctx) {
		super.draw(ctx);
		ctx.beginPath();
		ctx.arc(this._x, this._y, Constants.playerSize, 0, 2 * Math.PI);
		ctx.fill();
	}
}

exports.Player = Player;
},{"./Collisions":2,"./Constants":3,"./GameObject":4}],7:[function(require,module,exports){

/**************************************************
** GAME Resouce CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

class Resource extends GameObject {
  constructor(startX, startY) {
    super(startX, startY, Constants.resourceSize, Constants.resourceSize, '#000');
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.beginPath();
    ctx.arc(this._x, this._y, Constants.resourceSize, 0, 2 * Math.PI);
    ctx.fill();
  }
}

exports.Resource = Resource;
},{"./Constants":3,"./GameObject":4}],8:[function(require,module,exports){
var Bullet = require('./Bullet').Bullet;
var Constants = require('./Constants').Constants;
var Player = require('./Player').Player;
var Resource = require('./Resource').Resource;
var Keys = require('./Keys').Keys;
var GameObject = require('./GameObject').GameObject;
var Collisions = require('./Collisions').Collisions();
var requestAnimFrame = require('./requestAnimationFrame').requestAnimFrame;

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas, // Canvas DOM element
ctx, // Canvas rendering context
keys, // Keyboard input
localPlayer, // Local player
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
	state = localPlayer.update(keys, borders);
	if (state !== null) {
		socket.emit(state.command, state);
	};

	for (var i = 0; i < bullets.length; i++) {
		currentBullet = bullets[i];
		currentBullet.update();
		for (var j = 0; j < remotePlayers.length; j++) {
			currentPlayer = remotePlayers[j];
			if (currentBullet.collision(currentPlayer)) {
				console.log("A player has been hit!");
				remotePlayers.splice(j, 1);
				bullets.splice(i, 1);
			}
		}

		if (currentBullet.collision(localPlayer)) {
			console.log("You have been killed!");
			ready = false;
		}

		for (var j = 0; j < borders.length; j++) {
			if (currentBullet.collision(borders[j])) {
				bullets.splice(i, 1);
			}
		}
	}

	for (var i = 0; i < resources.length; i++) {
		var currentResource = resources[i];
		if (currentResource.collision(localPlayer)) {
			console.log("You have picked up a resource!");
			resources.splice(i, 1);
			localPlayer.setBulletCount(localPlayer.getBulletCount() + 1);
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
	for (i = 0; i < borders.length; i++) {
		borders[i].draw(ctx);
	}
	/*
 	ctx.fillStyle = '#000';
 	ctx.fillRect(0, 0, Constants.borderSize, Constants.gameHeight);
 	ctx.fillRect(0, 0, Constants.gameWidth, Constants.borderSize);
 	ctx.fillRect(0, Constants.gameHeight, Constants.gameWidth, Constants.borderSize);
 	ctx.fillRect(Constants.gameWidth, 0, Constants.borderSize, Constants.gameHeight);*/
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
},{"./Bullet":1,"./Collisions":2,"./Constants":3,"./GameObject":4,"./Keys":5,"./Player":6,"./Resource":7,"./requestAnimationFrame":9}],9:[function(require,module,exports){
// shim layer with setTimeout fallback
window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function ( /* function */callback, /* DOMElement */element) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

exports.requestAnimFrame = window.requestAnimFrame;
},{}]},{},[8]);
