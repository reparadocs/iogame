//@flow
/**************************************************
** GAME Resouce CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

class Resource extends GameObject {
  constructor(startX: number, startY: number) {
    super(
      startX,
      startY,
      Constants.resourceSize,
      Constants.resourceSize,
      '#000',
    );
  }

  draw(ctx: Object) {
    ctx.fillStyle = this._color;
    ctx.beginPath();
    ctx.arc(
      this._x,
      this._y,
      Constants.resourceSize,
      0, 2*Math.PI,
    );
    ctx.fill();
  }
}

exports.Resource = Resource;
