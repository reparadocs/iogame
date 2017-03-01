//@flow
/**************************************************
** GAME Bullet CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

if (typeof window === 'undefined') {
  var hasAudio = false;
} else {
  var GameAudio = require('./GameAudio').GameAudio;
  var hasAudio = true;
}

class Bullet extends GameObject {
  _dir: Array<number>;
  _size: number;
  _lifetime: number;
  _owner: Object;

  constructor(
    startX: number,
    startY: number,
    startDir: Array<number>,
    size: number,
    owner: Object,
  ) {
    super(startX, startY, size, size, '#000');
    this._dir = startDir;
    this._size = size;
    this._lifetime = Constants.bulletBaseLifetime
      + (this._size * Constants.bulletSizeLifeRatio);
    this._owner = owner;
  }

  getSize() {
    return this._size;
  }

  getDir() {
    return this._dir;
  }

  update(
    borders: Array<Object>,
    localPlayer: ?Object,
    remotePlayers: Array<Object>
  ) {
    this._x += this._dir[0] * Constants.bulletSpeed;
    this._y += this._dir[1] * Constants.bulletSpeed;
    this._size -= Constants.bulletDecayRate;
    this._lifetime -= 1;

    if (this._lifetime <= 0) {
      this._alive = false;
    }

    if (this._size < 1) {
      this._size = 1;
    }

    for (var i = 0; i < borders.length; i++) {
      if (this.collision(borders[i])) {
        this._alive = false;
      }
    }

    for (var i = 0; i < remotePlayers.length; i++) {
      if (
        this.collision(remotePlayers[i]) && remotePlayers[i].id != this._owner.id
      ) {
        this._alive = false;
        remotePlayers[i].damage(this._size);
        if (remotePlayers[i].getHealth() <= 0) {
          remotePlayers[i].setAlive(false);
          this._owner.setScore(this._owner.getScore() + 1);
        }
      }
    }

    if (
      localPlayer && localPlayer.id != this._owner.id && this.collision(localPlayer)
    ) {
      this._alive = false;
      if (hasAudio) {
        GameAudio.playDamage();
      }
      localPlayer.damage(this._size);
      if (localPlayer.getHealth() <= 0) {
        localPlayer.setAlive(false);
        this._owner.setScore(this._owner.getScore() + 1);
      }
    }
  }

  draw(ctx: Object) {
    ctx.fillStyle = this._color;
    ctx.beginPath();
    ctx.arc(
      this._x,
      this._y,
      this._size,
      0, 2*Math.PI,
    );
    ctx.fill();
  }
};

exports.Bullet = Bullet;
