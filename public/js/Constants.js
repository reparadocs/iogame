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
  gameHeight: 200,
  gameWidth: 200,

  borderSize: 2,

  playerSpeed: 3,
  playerSize: 10,

  bulletSize: 2,
  bulletSpeed: 5,
  bulletDelay: 200,
  bulletMaxSize: 40,
  bulletGrowthRate: 0.2,

  resourceSize: 2,
  numResources: 20,
};

exports.Constants = Constants;
