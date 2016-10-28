/**************************************************
** GAME Bullet CLASS
**************************************************/
var Bullet = function(startX, startY, startDir) {
  var x = startX,
    y = startY,
    dir = startDir,
    id;

  var setX = function(newX) {
    x = newX;
  };

  var setY = function(newY) {
    y = newY;
  };

  var setDir = function(newDir) {
    dir = newDir;
  };

  var getX = function() {
    return x;
  };

  var getY = function() {
    return y;
  };

  var getDir = function() {
    return dir;
  };

  var update = function() {
    x += dir[0] * Constants.bulletSpeed;
    y += dir[1] * Constants.bulletSpeed;
  };

  var draw = function(ctx) {
    ctx.fillRect(x-(Constants.bulletSize / 2), y-(Constants.bulletSize / 2), Constants.bulletSize, Constants.bulletSize);
  };

  return {
    update: update,
    draw: draw,
    setX: setX,
    setY: setY,
    setDir: setDir,
    getX: getX,
    getY: getY,
    getDir: getDir
  }
};

(function(exports){

  exports.Bullet = Bullet;

}(typeof exports === 'undefined' ? this.share = {} : exports));