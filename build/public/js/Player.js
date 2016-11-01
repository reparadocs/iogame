
/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var Collisions = require('./Collisions').Collisions();
var GameObject = require('./GameObject').GameObject;

class Player extends GameObject {

	constructor(startX, startY, color) {
		super(startX, startY, Constants.playerSize, Constants.playerSize, color);
		this._dir = [1, 0];
		this._isShooting = false;
		this._currentBulletSize = 0;
		this._bulletCount = 1;
	}

	getBulletCount() {
		return this._bulletCount;
	}

	setBulletCount(newBulletCount) {
		this._bulletCount = newBulletCount;
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

	update(keys, borders) {
		var prevX = this._x,
		    prevY = this._y;

		if (!keys.space && this._isShooting) {
			this._isShooting = false;
			var rtn = {
				command: "player shoots",
				x: this._x,
				y: this._y,
				dir: this._dir,
				size: this._currentBulletSize
			};
			this._currentBulletSize = 0;
			this._bulletCount = this._bulletCount - 1;
			return rtn;
		}

		if (keys.space) {
			if (this._bulletCount > 0) {
				this._isShooting = true;
				if (this._currentBulletSize < Constants.bulletMaxSize) {
					this._currentBulletSize += Constants.bulletGrowthRate;
				}
			}
		} else {
			if (keys.up) {
				this._dir = [0, -1];
			}
			if (keys.down) {
				this._dir = [0, 1];
			};
			if (keys.left) {
				this._dir = [-1, 0];
			}
			if (keys.right) {
				this._dir = [1, 0];
			};
			let borderCollision = false;
			for (var i = 0; i < borders.length; i++) {
				if (this.collision(borders[i], this._x + this._dir[0] * Constants.playerSpeed, this._y + this._dir[1] * Constants.playerSpeed)) {
					borderCollision = true;
					break;
				}
			}
			if (!borderCollision) {
				this._x = this._x + this._dir[0] * Constants.playerSpeed;
				this._y = this._y + this._dir[1] * Constants.playerSpeed;
			}

			if (prevX != this._x || prevY != this._y) {
				return { command: "move player", x: this._x, y: this._y, dir: this._dir };
			}
		}

		return null;
	}

	draw(ctx) {
		super.draw(ctx);
		ctx.beginPath();
		ctx.arc(this._x, this._y, Constants.playerSize, 0, 2 * Math.PI);
		ctx.fill();
	}
}

exports.Player = Player;