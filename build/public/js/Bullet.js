
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