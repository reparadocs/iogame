var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
//@flow
var util = require("util");
var Player = require("../public/js/Player").Player;
var Resource = require("../public/js/Resource").Resource;
var Bullet = require("../public/js/Bullet").Bullet;
var Constants = require("../public/js/Constants").Constants;
var Commands = require("../public/js/Commands").Commands;
var GameObject = require("../public/js/GameObject").GameObject;
var io = require("socket.io")(server);

server.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + '/../public'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/game/', function (req, res) {
  res.sendFile(path.resolve('build/public/game.html'));
});

var socket: Object,
    players: Array<Object>,
    bullets: Array<Object>,
    resources: Array<Object>,
    resourceCounter: number,
    lastTime: number,
    frame: number;

function init() {
  resourceCounter = 0;
  players = [];
  bullets = [];
  resources = [];
  borders = [new GameObject(Constants.borderSize / 2, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight, '#000'),
		new GameObject(Constants.gameWidth / 2, Constants.borderSize / 2, Constants.gameWidth, Constants.borderSize,  '#000'),
		new GameObject(Constants.gameWidth, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight,  '#000'),
		new GameObject(Constants.gameWidth / 2, Constants.gameHeight, Constants.gameWidth, Constants.borderSize,  '#000'),
    //new GameObject(Constants.gameWidth / 2, Constants.gameHeight / 3, Constants.gameWidth / 4, Constants.borderSize * 4, '#000')

  ];

  for (var i = 0; i < Constants.numResources; i++) {
    var startX = Math.round(Math.random()*(Constants.gameWidth-5)),
    startY = Math.round(Math.random()*(Constants.gameHeight-5));
    var newResource: Object = new Resource(startX, startY);
    resources.push(newResource);
  }

  setEventHandlers();
  lastTime = Date.now();
  frame = 0;
};

var setEventHandlers = function() {
  io.on('connection', onSocketConnection);
};

function onSocketConnection(client) {
  util.log("New player has connected: " + client.id);
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("change player direction", onChangePlayerDirection);
	client.on("player charges shot", onChargeShot)
	client.on("player shoots", onShoot);
  client.on("stop player", onPlayerStop);
};

function onClientDisconnect() {
  util.log("Player has disconnected: " + this.id);
  var removePlayer = playerById(this.id);

  if (!removePlayer) {
    util.log("Player not found: " + this.id);
    return;
  }

  players.splice(players.indexOf(removePlayer), 1);
  this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data: Object) {
  var newPlayer = new Player(data.x, data.y, data.dir, data.color, data.name, createBullet);
  newPlayer.id = this.id;
  this.broadcast.emit("new player", {
    id: newPlayer.id,
    x: newPlayer.getX(),
    y: newPlayer.getY(),
    dir: newPlayer.getDir(),
    color: newPlayer.getColor(),
    name: newPlayer.getName(),
  });
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {
      id: existingPlayer.id,
      x: existingPlayer.getX(),
      y: existingPlayer.getY(),
      dir: existingPlayer.getDir(),
      color: existingPlayer.getColor(),
      name: existingPlayer.getName(),
    });
  };
  for (i = 0; i < resources.length; i++) {
    var existingResource = resources[i];
    this.emit("resource spawned", {
      x: existingResource.getX(),
      y: existingResource.getY()
    });
  }
  players.push(newPlayer);
};

function onPlayerStop(data) {
  var player = playerById(this.id);
  if (!player) {
    console.log("Player not found: "+this.id);
    return;
  }
  Commands.changeDir(player, 0, 0);
  io.sockets.emit("update", {
    id: player.id,
    frame: frame,
    serialized: player.serialize(),
  });
}

function onChangePlayerDirection(data) {
	var player = playerById(this.id);
	if (!player) {
			console.log("Player not found: "+this.id);
			return;
	}
	Commands.changeDir(player, data.xDir, data.yDir);
  io.sockets.emit("update", {
    id: player.id,
    frame: frame,
    serialized: player.serialize(),
  });
};

function onChargeShot(data: Object) {
	var player = playerById(this.id);
	if (!player) {
			util.log("Player not found: "+this.id);
			return;
	};
	Commands.chargeShot(player, data.time);
  this.broadcast.emit("player charges shot", {
    id: player.id,
    frame: frame,
    time: data.time,
    serialized: player.serialize(),
  });
}

function onShoot(data: Object) {
	var player = playerById(this.id);
	if (!player) {
			util.log("Player not found: "+this.id);
			return;
	};
	Commands.shoot(player, data.time);
  this.broadcast.emit("player shoots", {
    id: player.id,
    frame: frame,
    time: data.time,
    serialized: player.serialize(),
  });
}

function playerById(id: String): Player {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
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

function update() {
	for (var i = 0; i < players.length; i++) {
		players[i].update(borders, resources);
		if (!players[i].getAlive()) {
      players[i].reset();
      io.sockets.emit("death", {
        id: players[i].id,
        frame: frame,
        serialized: players[i].serialize(),
        color: players[i].getColor(),
      });
		} else if (frame % 2 === 0) {
      io.sockets.emit("update", {
        id: players[i].id,
        frame: frame,
        serialized: players[i].serialize()
      });
    }
	}

	for (var i = 0; i < bullets.length; i++) {
		bullets[i].update(borders, null, players);
		if (!bullets[i].getAlive()) {
			bullets.splice(i, 1);
		}
	}

	for (var i = 0; i < resources.length; i++) {
		if (!resources[i].getAlive()) {
			resources.splice(i, 1);
		}
	}

  resourceCounter += 1;
  if (resourceCounter > Constants.resourceSpawnRate) {
    resourceCounter = 0;
    var startX = Math.round(Math.random()*(Constants.gameWidth-5)),
    startY = Math.round(Math.random()*(Constants.gameHeight-5));
    var newResource: Object = new Resource(startX, startY);
    resources.push(newResource);
    io.sockets.emit("resource spawned", {
      x: newResource.getX(),
      y: newResource.getY()
    });
  }
};

function loop() {
  var framesToRun = Math.floor((Date.now() - lastTime) / (1000 / 60));
  for (var i = 0; i < framesToRun; i++) {
    frame += 1;
    update();
  }
  lastTime += framesToRun * (1000 / 60);
}

init();

setInterval(loop, 1000 / 60);
