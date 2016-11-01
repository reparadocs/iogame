//@flow
/**************************************************
** GAME GameObject CLASS
**************************************************/
class GameObject {
  _x: number;
  _y: number;
  _height: number;
  _width: number;
  _color: string;

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
    ctx.fillRect(this._x - (this._width / 2), this._y - (this._height / 2),this._width, this._height);
  }
}

exports.GameObject = GameObject;
