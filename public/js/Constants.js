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
  numResources: number,
  maxHistoryBuffer: number,

  name_suffix_animals: Array<string>,
  name_prefix_adjectives: Array<string>,

  color_pink: string,
  color_dark_pink: string,
  color_black: string,

  font_size_scoreboard: string,
  font_size_user_stats: string,

} = {
  gameHeight: 600,
  gameWidth: 1000,

  borderSize: 2,

  playerSpeed: 3,
  playerSize: 15,

  bulletSpeed: 7,
  bulletMaxSize: 90,
  bulletGrowthRate: 0.01,

  resourceSize: 2,
  numResources: 100,

  resourceSpawnRate: 60,

  maxHistoryBuffer: 500,

  name_suffix_animals: ['alligator', 'ant', 'antelope', 'bat', 'bear', 'beaver', 'bee', 'beetle',
  'bluebird', 'buffalo', 'bunny', 'butterfly', 'bull', 'camel', 'cat', 'chicken',
  'chimpanzee', 'chipmunk', 'cow', 'coyote', 'crab', 'crane', 'crocodile', 'deer',
  'dog', 'dolphin', 'donkey', 'dove', 'dragon', 'eagle', 'elk', 'eel', 'fish', 'flamingo',
  'fly', 'fox', 'frog', 'giraffe', 'goat', 'goose', 'gorilla', 'horse', 'hummingbird',
  'jaguar', 'koala', 'ladybug', 'lamb', 'lizard', 'llama', 'lobster', 'monkey', 'moose',
  'moth', 'mouse', 'ostrich', 'rabbit', 'rat', 'robin', 'rooster', 'seahorse', 'shark',
  'sheep', 'toad', 'unicorn','zebra'],

  name_prefix_adjectives: ['incredible', 'awesome', 'amazing', 'marvelous', 'wonderful',
  'unbelievable', 'stunning', 'astonishing', 'astounding', 'breathtaking',
  'extraordinary', 'fabulous', 'fantastic', 'phenomenal', 'remarkable',
  'spectacular', 'sensational'],

  color_pink: '#FFC0CB',
  color_dark_pink: '#E5ACB6',
  color_black: '#000',

  font_size_user_stats: "20px serif",
  font_size_scoreboard: "28px serif",

};

exports.Constants = Constants;
