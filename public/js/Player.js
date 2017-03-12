//@flow
/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

if (typeof window === 'undefined') {
  var hasAudio = false;
} else {
  var GameAudio = require('./GameAudio').GameAudio;
  var hasAudio = true;
}

class Player extends GameObject {
  _dir: Array<number>;
  id: string;
  _bulletCount: number;
  _chargeTime: number;
  _health: number;
  _score: number;
  _shootDir: Array<number>;
  _createBullet: Function;
  _name: string;
  _init_name: boolean;

  constructor(
    startX: number,
    startY: number,
    dir: Array<number>,
    color: string,
    name: string,
    createBullet: Function
  ) {
    super(startX, startY, Constants.playerSize, Constants.playerSize, color);
    this._dir = dir;
    this._shootDir = dir;
    this._bulletCount = 1;
    this._chargeTime = 0;
    this._createBullet = createBullet;
    this._score = 0;
    this._health = Constants.playerHealth;
    this._init_name = false;
    this._name = this._generateName(name);
    this._color = this._generateColor(color);
  }

  _generateColor(color: string) {
    if (color != null && color != '') {
      return color;
    }
    return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  }
  
  _generateName(name: string) {
    if (name != null && name != '') {
      return name;
    }
    const adjective = Constants.name_prefix_adjectives[
      Math.floor(Math.random()*Constants.name_prefix_adjectives.length)
    ];
    const animal = Constants.name_suffix_animals[
      Math.floor(Math.random()*Constants.name_suffix_animals.length)
    ];
    return adjective + " " + animal
  }

  getName() {
    return this._name;
  }

  getBulletCount() {
    return this._bulletCount;
  }

  getHealth() {
    return this._health;
  }

  damage(size: number) {
    this._health -= size * Constants.bulletSizeDamageRatio;
  }

  setBulletCount(newBulletCount: number) {
    this._bulletCount = newBulletCount;
  }

  getScore() {
    return this._score;
  }

  setScore(score: number) {
    this._score = score;
  }

  setDir(dir: Array<number>) {
    this._dir = dir;
    if (dir[0] !== 0 || dir[1] !== 0) {
      this._shootDir = dir;
    }
  }

  getDir() {
    return this._dir;
  }

  getColor() {
    return this._color;
  }

  chargeShot(time: number) {
    if (this._bulletCount > 0) {
      this._chargeTime = time;
    }
  }

  shoot(time: number) {
    if (this._chargeTime !== 0 && this._bulletCount > 0) {
      const charged = time - this._chargeTime;
      this._bulletCount -= 1;
      let size =
      charged * Constants.bulletGrowthRate > Constants.bulletMaxSize
      ? Constants.bulletMaxSize
      : charged * Constants.bulletGrowthRate;
      if (size < 1) {
        size = 1;
      }
      this._createBullet(this._x, this._y, this._shootDir, size, this);
      if (hasAudio) {
        GameAudio.playShoot();
      }
    }
    this._chargeTime = 0;
  }

  update(borders: Array<Object>, resources: ?Array<Object> = null) {
    let borderCollision = false;
    for (var i = 0; i < borders.length; i++) {
      if (this.collision(
        borders[i],
        this._x + this._dir[0] * Constants.playerSpeed,
        this._y + this._dir[1] * Constants.playerSpeed,
      )) {
        borderCollision = true;
        break;
      }
    }

    if (!borderCollision && this._chargeTime === 0) {
      this._x += this._dir[0] * Constants.playerSpeed;
      this._y += this._dir[1] * Constants.playerSpeed;

      if (resources) {
        for (var i = 0; i < resources.length; i++) {
          if (this.collision(resources[i])) {
            resources[i].setAlive(false);
            this._bulletCount += 1;
            if (hasAudio) {
              GameAudio.playResource();
            }
          }
        }
      }
    }
  }

  draw(ctx: Object) {
    const x_pos = this._x;
    const y_pos = this._y;

    ctx.fillStyle = this._color;
    ctx.beginPath();
    ctx.arc(x_pos, y_pos, Constants.playerSize, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff";

    ctx.beginPath()
    ctx.moveTo(
      x_pos + (Constants.playerSize * this._shootDir[0]), 
      y_pos + (Constants.playerSize * this._shootDir[1])
    );

    ctx.lineTo(
      x_pos + ((Constants.playerSize / 2) * this._shootDir[1]),
      y_pos + ((Constants.playerSize / 2) * -1 * this._shootDir[0])
    );
    
    ctx.lineTo(
      x_pos - ((Constants.playerSize / 2) * this._shootDir[1]),
      y_pos - ((Constants.playerSize / 2) * -1 * this._shootDir[0])
    );
    ctx.fill();

    ctx.fillStyle = '#000';
    if (this._chargeTime !== 0) {
      ctx.beginPath();
      const charged = Date.now() - this._chargeTime;
      let size =
      charged * Constants.bulletGrowthRate > Constants.bulletMaxSize
      ? Constants.bulletMaxSize
      : charged * Constants.bulletGrowthRate;
      if (size < 1) {
        size = 1;
      }
      ctx.arc(x_pos, y_pos, size, 0, 2*Math.PI);
      ctx.moveTo(
        x_pos + (size * this._shootDir[0]),
        y_pos + (size * this._shootDir[1])
      );
      ctx.lineTo(
        x_pos + ((size - 5) * this._shootDir[0]),
        y_pos + ((size - 5) * this._shootDir[1])
      );
      ctx.stroke();
    }

    ctx.font = "18px serif";
    ctx.fillText(
      this._bulletCount,
      this._x - 5,
      this._y + 5,
    );

    ctx.fillStyle = "#777777";
    ctx.fillRect(
      (this._x - this._width) - 3,
      (this._y - this._height) - 10,
      35,
      7);
    ctx.fillStyle = "#32CD32";
    ctx.fillRect(
      (this._x - this._width) - 2,
      (this._y - this._height) - 9,
      ((this._health / Constants.playerHealth) * 33),
      5);





  }

  serialize() {
    let serialized = super.serialize();
    serialized.dir = this._dir;
    serialized.bulletCount = this._bulletCount;
    serialized.score = this._score;
    return serialized;
  }

  reset(color: ?string = null) {
    this._x = Math.round(Math.random()*(Constants.gameWidth-40)) + 20;
    this._y = Math.round(Math.random()*(Constants.gameHeight-40)) + 20;
    this._bulletCount = 1;
    this._alive = true;
    this._health = Constants.playerHealth;
    //this._score = 0;
    this._dir = [1,0];
    this._shootDir = this._dir;
  }
}

exports.Player = Player;
