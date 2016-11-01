var express = require('express');
var app = express();
var server = require('http').Server(app);

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
  res.sendFile(__dirname + '../public/index.html');
});

var socket, players, bullets, resources;

function init() {
  players = [];
  bullets = [];
  resources = [];
  borders = [new GameObject(Constants.borderSize / 2, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight, '#000'), new GameObject(Constants.gameWidth / 2, Constants.borderSize / 2, Constants.gameWidth, Constants.borderSize, '#000'), new GameObject(Constants.gameWidth, Constants.gameHeight / 2, Constants.borderSize, Constants.gameHeight, '#000'), new GameObject(Constants.gameWidth / 2, Constants.gameHeight, Constants.gameWidth, Constants.borderSize, '#000')];

  for (var i = 0; i < Constants.numResources; i++) {
    var startX = Math.round(Math.random() * (Constants.gameWidth - 5)),
        startY = Math.round(Math.random() * (Constants.gameHeight - 5));
    var newResource = new Resource(startX, startY);
    resources.push(newResource);
  }

  setEventHandlers();
};

var setEventHandlers = function () {
  io.on('connection', onSocketConnection);
};

function onSocketConnection(client) {
  util.log("New player has connected: " + client.id);
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("change player direction", onChangePlayerDirection);
  client.on("player charges shot", onChargeShot);
  client.on("player shoots", onShoot);
};

function onClientDisconnect() {
  util.log("Player has disconnected: " + this.id);
  var removePlayer = playerById(this.id);

  if (!removePlayer) {
    util.log("Player not found: " + this.id);
    return;
  }

  players.splice(players.indexOf(removePlayer), 1);
  this.broadcast.emit("remove player", { id: this.id });
};

function onNewPlayer(data) {
  var newPlayer = new Player(data.x, data.y, data.dir, data.color, createBullet);
  newPlayer.id = this.id;
  this.broadcast.emit("new player", {
    id: newPlayer.id,
    x: newPlayer.getX(),
    y: newPlayer.getY(),
    dir: newPlayer.getDir(),
    color: newPlayer.getColor()
  });
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {
      id: existingPlayer.id,
      x: existingPlayer.getX(),
      y: existingPlayer.getY(),
      dir: existingPlayer.getDir(),
      color: existingPlayer.getColor()
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

function onChangePlayerDirection(data) {
  var player = playerById(this.id);
  if (!player) {
    util.log("Player not found: " + this.id);
    return;
  };
  Commands.changeDirection(player, data.xDir, data.yDir);
  this.broadcast.emit("change player direction", {
    id: player.id,
    xDir: player.getDir()[0],
    yDir: player.getDir()[1]
  });
};

function onChargeShot(data) {
  var player = playerById(this.id);
  if (!player) {
    util.log("Player not found: " + this.id);
    return;
  };
  Commands.chargeShot(player, data.time);
  this.broadcast.emit("player charges shot", {
    id: player.id,
    time: data.time
  });
}

function onShoot(data) {
  var player = playerById(this.id);
  if (!player) {
    util.log("Player not found: " + this.id);
    return;
  };
  Commands.shoot(player, data.time);
  this.broadcast.emit("player shoots", {
    id: player.id,
    time: data.time
  });
}

function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return false;
};

function createBullet(x, y, dir, size, owner) {
  bullets.push(new Bullet(x, y, dir, size, owner));
}

function update() {
  for (var i = 0; i < players.length; i++) {
    players[i].update(borders, resources);
    if (!players[i].getAlive()) {
      players.splice(i, 1);
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
};

init();

setInterval(update, 1000 / 60);