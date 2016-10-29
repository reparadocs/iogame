var Constants = {
  gameHeight: 600,
  gameWidth: 1000,

  borderSize: 2,

  playerSpeed: 3,
  playerSize: 10,

  bulletSize: 2,
  bulletSpeed: 5,
  bulletDelay: 200,
  bulletMaxSize: 40,
  bulletGrowthRate: 0.2,

  resourceSize: 2,
  numResources: 100
};

(function(exports){

  exports.Constants = {
    numResources: Constants.numResources,
    gameWidth: Constants.gameWidth,
    gameHeight: Constants.gameHeight
  };

}(typeof exports === 'undefined' ? this.share = {} : exports));