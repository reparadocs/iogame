//@flow
/**************************************************
** Collisions Class
**************************************************/
var Collisions = function() {
  var hasCollided = function(obj1: Object, obj2: Object, obj2XSize: number, obj2YSize: number) {
    if (inBounds(obj1, obj2, obj2XSize, obj2YSize)) {
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
    hasCollided: hasCollided
  }
};

exports.Collisions = Collisions;
