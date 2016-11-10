//@flow
var Constants: {
  gameHeight: number,
  gameWidth: number,

  borderSize: number,

  playerSpeed: number,
  playerSize: number,

  bulletSpeed: number,
  bulletMaxSize: number,
  bulletGrowthRate: number,

  resourceSize: number,
  numResources: number
} = {
  gameHeight: 500,
  gameWidth: 900,

  borderSize: 5,

  playerSpeed: 3,
  playerSize: 15,

  bulletSpeed: 7,
  bulletMaxSize: 90,
  bulletGrowthRate: 0.01,

  resourceSize: 2,
  numResources: 100,
  resourceSpawnRate: 60,
};

exports.Constants = Constants;
