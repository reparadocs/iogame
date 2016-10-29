var express = require('express');
var app = express();
var server = require('http').Server(app);
//@flow
var util = require("util");
var Player = require("../public/js/Player").Player;
var Resource = require("../public/js/Resource").Resource;
var Bullet = require("../public/js/Bullet").Bullet;
var Collisions = require("../public/js/Collisions").Collisions;
var Constants = require("../public/js/Constants").Constants;
var io = require("socket.io")(server);

server.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + '/../public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '../public/index.html');
});

var socket: Object, players: Array<Object>, bullets: Array<Object>, resources: Array<Object>;

function init() {
  players = [];
  bullets = [];
  resources = [];

  for (var i = 0; i < Constants.numResources; i++) {
    var startX = Math.round(Math.random()*(Constants.gameWidth-5)),
    startY = Math.round(Math.random()*(Constants.gameHeight-5));
    var newResource: Object = Resource(startX, startY);
    resources.push(newResource);
  }

  setEventHandlers();
};

var setEventHandlers = function() {
  io.on('connection', onSocketConnection);
};

function onSocketConnection(client) {
  util.log("New player has connected: " + client.id);
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("move player", onMovePlayer);
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
  this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data: Object) {
  var newPlayer = new Player(data.x, data.y, data.color);
  newPlayer.id = this.id;
  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), dir: newPlayer.getDir(), color: newPlayer.getColor()});
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), dir: existingPlayer.getDir(), color: existingPlayer.getColor()});
  };
  for (i = 0; i < resources.length; i++) {
    var existingResource = resources[i];
    this.emit("resource spawned", {x: existingResource.getX(), y: existingResource.getY()});
  }
  players.push(newPlayer);
};

function onMovePlayer(data: Object) {
  var movePlayer = playerById(this.id);

  if (!movePlayer) {
    util.log("Player not found: "+this.id);
    return;
  };

  movePlayer.setX(data.x);
  movePlayer.setY(data.y);
  movePlayer.setDir(data.dir)

  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), dir: movePlayer.getDir()});
};

function onShoot(data: Object) {
  var newBullet = new Bullet(data.x, data.y, data.dir, data.size);
  bullets.push(newBullet);
  io.sockets.emit("player shoots", {x: newBullet.getX(), y: newBullet.getY(), dir: newBullet.getDir(), size: newBullet.getSize()});
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

init();
