(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**************************************************
** GAME Bullet CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

class Bullet extends GameObject {

  constructor(startX, startY, startDir, size, owner) {
    super(startX, startY, size, size, '#000');
    this._dir = startDir;
    this._size = size;
    this._owner = owner;
  }

  getSize() {
    return this._size;
  }

  getDir() {
    return this._dir;
  }

  update(borders, localPlayer, remotePlayers) {
    this._x += this._dir[0] * Constants.bulletSpeed;
    this._y += this._dir[1] * Constants.bulletSpeed;

    for (var i = 0; i < borders.length; i++) {
      if (this.collision(borders[i])) {
        this._alive = false;
      }
    }

    for (var i = 0; i < remotePlayers.length; i++) {
      if (this.collision(remotePlayers[i]) && remotePlayers[i].id != this._owner) {
        this._alive = false;
        remotePlayers[i].setAlive(false);
      }
    }

    if (localPlayer.id != this._owner && this.collision(localPlayer)) {
      this._alive = false;
      localPlayer.setAlive(false);
    }
  }

  draw(ctx) {
    ctx.fillStyle = this._color;
    ctx.beginPath();
    ctx.arc(this._x, this._y, this._size, 0, 2 * Math.PI);
    ctx.fill();
  }
};

exports.Bullet = Bullet;
},{"./Constants":3,"./GameObject":4}],2:[function(require,module,exports){
class Commands {
  static changeDirection(player, xDir, yDir, socket = null) {
    player.setDir([xDir, yDir]);
    if (socket) {
      socket.emit("change player direction", { xDir: xDir, yDir: yDir });
    }
  }

  static chargeShot(player, time, socket = null) {
    player.chargeShot(time);
    if (socket) {
      socket.emit("player charges shot", { time: time });
    }
  }

  static shoot(player, time, socket = null) {
    player.shoot(time);
    if (socket) {
      socket.emit("player shoots", { time: time });
    }
  }
}

exports.Commands = Commands;
},{}],3:[function(require,module,exports){
var Constants = {
  gameHeight: 600,
  gameWidth: 1000,

  borderSize: 2,

  playerSpeed: 3,
  playerSize: 10,

  bulletSpeed: 5,
  bulletMaxSize: 40,
  bulletGrowthRate: 0.02,

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
    this._alive = true;
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

  getAlive() {
    return this._alive;
  }

  setAlive(alive) {
    this._alive = alive;
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
var Commands = require('./Commands').Commands;

class Keys {

	constructor(localPlayer, socket) {
		this._localPlayer = localPlayer;
		this._socket = socket;
		this._fired = true;
	}

	onKeyDown(e) {
		const c = e.keyCode;
		switch (c) {
			case 32:
				// Space
				if (this._fired) {
					this._fired = false;
					Commands.chargeShot(this._localPlayer, Date.now(), this._socket);
				}
				break;
			case 37:
				// Left
				Commands.changeDirection(this._localPlayer, -1, 0, this._socket);
				break;
			case 38:
				// Up
				Commands.changeDirection(this._localPlayer, 0, -1, this._socket);
				break;
			case 39:
				// Right
				Commands.changeDirection(this._localPlayer, 1, 0, this._socket);
				break;
			case 40:
				// Down
				Commands.changeDirection(this._localPlayer, 0, 1, this._socket);
				break;
		};
	}

	onKeyUp(e) {
		const c = e.keyCode;
		switch (c) {
			case 32:
				// Space
				this._fired = true;
				Commands.shoot(this._localPlayer, Date.now(), this._socket);
				break;
		};
	}
}

exports.Keys = Keys;
},{"./Commands":2}],6:[function(require,module,exports){

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

class Player extends GameObject {

	constructor(startX, startY, color, createBullet) {
		super(startX, startY, Constants.playerSize, Constants.playerSize, color);
		this._dir = [1, 0];
		this._isShooting = false;
		this._currentBulletSize = 0;
		this._bulletCount = 1;
		this._chargeTime = 0;
		this._createBullet = createBullet;
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

	chargeShot(time) {
		if (this._bulletCount > 0) {
			this._chargeTime = time;
		}
	}

	shoot(time) {
		if (this._chargeTime !== 0 && this._bulletCount > 0) {
			const charged = time - this._chargeTime;
			this._bulletCount -= 1;
			const size = charged * Constants.bulletGrowthRate > Constants.bulletMaxSize ? Constants.bulletMaxSize : charged * Constants.bulletGrowthRate;
			this._createBullet(this._x, this._y, this._dir, size, this.id);
		}
		this._chargeTime = 0;
	}

	update(borders, resources) {
		let borderCollision = false;
		for (var i = 0; i < borders.length; i++) {
			if (this.collision(borders[i], this._x + this._dir[0] * Constants.playerSpeed, this._y + this._dir[1] * Constants.playerSpeed)) {
				borderCollision = true;
				break;
			}
		}

		if (!borderCollision && this._chargeTime === 0) {
			this._x = this._x + this._dir[0] * Constants.playerSpeed;
			this._y = this._y + this._dir[1] * Constants.playerSpeed;

			for (var i = 0; i < resources.length; i++) {
				if (this.collision(resources[i])) {
					resources[i].setAlive(false);
					this._bulletCount += 1;
				}
			}
		}
	}

	draw(ctx) {
		ctx.fillStyle = this._color;
		ctx.beginPath();
		ctx.arc(this._x, this._y, Constants.playerSize, 0, 2 * Math.PI);
		ctx.fill();
	}
}

exports.Player = Player;
},{"./Constants":3,"./GameObject":4}],7:[function(require,module,exports){

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
    ctx.fillStyle = this._color;
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
},{"./Bullet":1,"./Commands":2,"./Constants":3,"./GameObject":4,"./Keys":5,"./Player":6,"./Resource":7,"./requestAnimationFrame":9}],9:[function(require,module,exports){
// shim layer with setTimeout fallback
window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function ( /* function */callback, /* DOMElement */element) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

exports.requestAnimFrame = window.requestAnimFrame;
},{}]},{},[8]);
