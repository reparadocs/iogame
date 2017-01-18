//@flow
/**************************************************
** GAME GameObject CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var Globals = require('./Globals').Globals;

class GameObject {
  _x: number;
  _y: number;
  _height: number;
  _width: number;
  _color: string;
  _alive: boolean;

  constructor(
    startX: number,
    startY: number,
    width: number,
    height: number,
    color: string,
  ) {
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

  setX(newX: number) {
    this._x = newX;
  }

  setY(newY: number) {
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

  setAlive(alive: boolean) {
    this._alive = alive;
  }

  collision(otherObj: GameObject, x: ?number, y: ?number) {
    x = x || this._x;
    y = y || this._y;
    const diffX = Math.abs(x - otherObj.getX());
    const diffY = Math.abs(y - otherObj.getY());
    const distX = otherObj.getWidth() + this._width;
    const distY = otherObj.getHeight() + this._height;
    return diffX < distX && diffY < distY;
  }

  draw(ctx: Object) {
    ctx.fillStyle = this._color;
    ctx.fillRect(
      ((this._x - this._width / 2) * Globals.widthRatio),
      ((this._y - this._height / 2) * Globals.heightRatio),
      (Globals.widthRatio * this._width * 2),
      (Globals.heightRatio * this._height * 2),
    );
  }

  applyUpdate(data: Object) {
    this._alive = data.alive;
    this._x = data.x;
    this._y = data.y;
  }

  serialize() {
    let serialized: Object = {
      alive: this._alive,
      x: this._x,
      y: this._y,
    };
    return serialized;
  }
}

exports.GameObject = GameObject;
