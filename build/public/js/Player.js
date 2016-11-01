
/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var GameObject = require('./GameObject').GameObject;

class Player extends GameObject {

	constructor(startX, startY, dir, color, createBullet) {
		super(startX, startY, Constants.playerSize, Constants.playerSize, color);
		this._dir = dir;
		this._isShooting = false;
		this._currentBulletSize = 0;
		this._bulletCount = 1;
		this._chargeTime = 0;
		this._createBullet = createBullet;
		this._score = 0;
	}

	getBulletCount() {
		return this._bulletCount;
	}

	setBulletCount(newBulletCount) {
		this._bulletCount = newBulletCount;
	}

	getScore() {
		return this._score;
	}

	setScore(score) {
		this._score = score;
	}

	getDir() {
		return this._dir;
	}

	setDir(dir) {
		this._dir = dir;
	}

	getColor() {
		return this._color;
	}

	chargeShot(time) {
		if (this._bulletCount > 0) {
			this._chargeTime = time;
		}
	}

	shoot(time) {
		if (this._chargeTime !== 0 && this._bulletCount > 0) {
			const charged = time - this._chargeTime;
			this._bulletCount -= 1;
			const size = charged * Constants.bulletGrowthRate > Constants.bulletMaxSize ? Constants.bulletMaxSize : charged * Constants.bulletGrowthRate;
			this._createBullet(this._x, this._y, this._dir, size, this);
		}
		this._chargeTime = 0;
	}

	update(borders, resources) {
		let borderCollision = false;
		for (var i = 0; i < borders.length; i++) {
			if (this.collision(borders[i], this._x + this._dir[0] * Constants.playerSpeed, this._y + this._dir[1] * Constants.playerSpeed)) {
				borderCollision = true;
				break;
			}
		}

		if (!borderCollision && this._chargeTime === 0) {
			this._x = this._x + this._dir[0] * Constants.playerSpeed;
			this._y = this._y + this._dir[1] * Constants.playerSpeed;

			for (var i = 0; i < resources.length; i++) {
				if (this.collision(resources[i])) {
					resources[i].setAlive(false);
					this._bulletCount += 1;
				}
			}
		}
	}

	draw(ctx) {
		ctx.fillStyle = this._color;
		ctx.beginPath();
		ctx.arc(this._x, this._y, Constants.playerSize, 0, 2 * Math.PI);
		ctx.fill();
	}
}

exports.Player = Player;