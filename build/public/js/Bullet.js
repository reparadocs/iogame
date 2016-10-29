
/**************************************************
** GAME Bullet CLASS
**************************************************/
var Constants = require('./Constants').Constants;

var Bullet = function (startX, startY, startDir, size) {
  var x = startX,
      y = startY,
      dir = startDir,
      size = size,
      id;

  var setX = function (newX) {
    x = newX;
  };

  var setY = function (newY) {
    y = newY;
  };

  var setDir = function (newDir) {
    dir = newDir;
  };

  var getX = function () {
    return x;
  };

  var getY = function () {
    return y;
  };

  var getDir = function () {
    return dir;
  };

  var getSize = function () {
    return size;
  };

  var update = function () {
    x += dir[0] * Constants.bulletSpeed;
    y += dir[1] * Constants.bulletSpeed;
  };

  var draw = function (ctx) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
  };

  return {
    update: update,
    draw: draw,
    setX: setX,
    setY: setY,
    setDir: setDir,
    getX: getX,
    getY: getY,
    getDir: getDir,
    getSize: getSize
  };
};

exports.Bullet = Bullet;