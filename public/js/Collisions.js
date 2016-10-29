/**************************************************
** Collisions Class
**************************************************/
var Collisions = function() {
  var hasCollided = function(player, bullet) {
    if (inBounds(bullet, player, Constants.playerSize, Constants.playerSize)) {
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

(function(exports){

  exports.Collisions = Collisions;

}(typeof exports === 'undefined' ? this.share = {} : exports));