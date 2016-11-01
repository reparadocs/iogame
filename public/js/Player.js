//@flow
/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

class Player extends GameObject {
	_dir: Array<number>;
	id: string;
	_bulletCount: number;
	_chargeTime: number;
	_score: number;
	_move: Array<number>;
	_createBullet: Function;

	constructor(startX: number, startY: number, dir: Array<number>, color: string, createBullet: Function) {
		super(startX, startY, Constants.playerSize, Constants.playerSize, color);
		this._dir = dir;
		this._bulletCount = 1;
		this._chargeTime = 0;
		this._createBullet = createBullet;
		this._score = 0;
		this._move = [0,0];
	}

	getBulletCount() {
		return this._bulletCount;
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

	setMove(move: Array<number>) {
		this._move = move;
		this._dir = move;
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
			const size =
				charged * Constants.bulletGrowthRate > Constants.bulletMaxSize
				? Constants.bulletMaxSize
				: charged * Constants.bulletGrowthRate;
			this._createBullet(this._x, this._y, this._dir, size, this);
		}
		this._chargeTime = 0;
	}

	update(borders: Array<Object>, resources: Array<Object>) {
		let borderCollision = false;
		for (var i = 0; i < borders.length; i++) {
			if (this.collision(
				borders[i],
				this._x + this._move[0] * Constants.playerSpeed,
				this._y + this._move[1] * Constants.playerSpeed,
			)) {
				borderCollision = true;
				break;
			}
		}

		if (!borderCollision && this._chargeTime === 0) {
			this._x += this._move[0] * Constants.playerSpeed;
			this._y += this._move[1] * Constants.playerSpeed;

			for (var i = 0; i < resources.length; i++) {
				if (this.collision(resources[i])) {
					resources[i].setAlive(false);
					this._bulletCount += 1;
				}
			}
		}
		this._move = [0,0];
	}

	draw(ctx: Object) {
		ctx.fillStyle = this._color;
		ctx.beginPath();
		ctx.arc(this._x, this._y, Constants.playerSize, 0, 2*Math.PI);
		ctx.fill();
	}

	applyUpdate(data: Object) {
		super.applyUpdate(data);
		this._dir = data.dir;
		this._bulletCount = data.bulletCount;
		this._score = data.score;
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
		this._score = 0;
		this._move = [0,0];
		this._color = color ? color : '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		this._dir = [1,0];
	}
}

exports.Player = Player;
