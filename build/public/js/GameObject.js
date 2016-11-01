
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