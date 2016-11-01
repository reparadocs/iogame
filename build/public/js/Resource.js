
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