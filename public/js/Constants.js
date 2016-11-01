//@flow
var Constants: {
  gameHeight: number,
  gameWidth: number,

  borderSize: number,

  playerSpeed: number,
  playerSize: number,

  bulletSize: number,
  bulletSpeed: number,
  bulletDelay: number,
  bulletMaxSize: number,
  bulletGrowthRate: number,

  resourceSize: number,
  numResources: number
} = {
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

exports.Constants = Constants;
