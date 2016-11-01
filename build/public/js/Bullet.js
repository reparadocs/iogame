
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
      if (this.collision(remotePlayers[i]) && remotePlayers[i].id != this._owner.id) {
        this._alive = false;
        remotePlayers[i].setAlive(false);
        this._owner.setScore(this._owner.getScore() + 1);
      }
    }

    if (localPlayer && localPlayer.id != this._owner.id && this.collision(localPlayer)) {
      this._alive = false;
      localPlayer.setAlive(false);
      this._owner.setScore(this._owner.getScore() + 1);
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