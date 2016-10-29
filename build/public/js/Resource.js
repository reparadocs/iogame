
/**************************************************
** GAME Resouce CLASS
**************************************************/
var Constants = require('./Constants').Constants;

var Resource = function (startX, startY) {
  var x = startX,
      y = startY,
      id;

  var getX = function () {
    return x;
  };

  var getY = function () {
    return y;
  };

  var update = function () {};

  var draw = function (ctx) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, Constants.resourceSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  return {
    update: update,
    draw: draw,
    getX: getX,
    getY: getY
  };
};

exports.Resource = Resource;