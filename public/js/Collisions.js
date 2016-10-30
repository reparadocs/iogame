//@flow
/**************************************************
** Collisions Class
**************************************************/
var Constants = require('./Constants').Constants;

var Collisions = function() {
  var hasHitBoundary = function(
    x: number,
    y: number,
    dir: Array<number>,
    playerSpeed: number,
    size: number,
  ) {
    var x_pos = x + dir[0] * playerSpeed + size;
    var x_neg = x + dir[0] * playerSpeed - size;
    var y_pos = y + dir[1] * playerSpeed + size;
    var y_neg = y + dir[1] * playerSpeed - size;
    if (x_neg <= 0 || x_pos >= Constants.gameWidth || y_neg <= 0 || y_pos >= Constants.gameHeight) {
      return true;
    }
    return false;
  };

  var hasCollided = function(
    obj1: Object,
    obj2: Object,
    obj1XSize: number,
    obj1YSize: number,
    obj2XSize: number,
    obj2YSize: number
  ) {
    if (inBounds(obj1, obj2, obj2XSize, obj2YSize) ||
      inBounds(obj2, obj1, obj1XSize, obj1YSize)) {
      return true;
    }
    return false;
  };

  var inBounds = function (obj1, obj2, obj2XSize, obj2YSize) {
    if (obj1.getX() > (obj2.getX() - obj2XSize / 2) &&
      obj1.getX() < (obj2.getX() + obj2XSize / 2) &&
      obj1.getY() > (obj2.getY() - obj2YSize/ 2) &&
      obj1.getY() < (obj2.getY() + obj2YSize / 2)) {
      return true;
    }
    return false;
  };

  return {
    hasCollided: hasCollided,
    hasHitBoundary: hasHitBoundary
  }
};

exports.Collisions = Collisions;
