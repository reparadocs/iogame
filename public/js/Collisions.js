/**************************************************
** Collisions Class
**************************************************/
var Collisions = function() {
  var hasHitBoundary = function(x, y, dir, playerSpeed, size) {
    x_pos = x + dir[0] * playerSpeed + size;
    x_neg = x + dir[0] * playerSpeed - size;
    y_pos = y + dir[1] * playerSpeed + size;
    y_neg = y + dir[1] * playerSpeed - size;
    if (x_neg <= 0 || x_pos >= Constants.gameWidth || y_neg <= 0 || y_pos >= Constants.gameHeight) {
      return true;
    }
    return false;
  }

  var hasCollided = function(obj1, obj2, obj1XSize, obj1YSize, obj2XSize, obj2YSize) {
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

(function(exports){

  exports.Collisions = Collisions;

}(typeof exports === 'undefined' ? this.share = {} : exports));