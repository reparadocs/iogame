
/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Constants = require('./Constants').Constants;
var Collisions = require('./Collisions').Collisions();

var Player = function (startX, startY, color) {
	var x = startX,
	    y = startY,
	    dir = [1, 0],
	    color = color,
	    isShooting = false,
	    currentBulletSize = 0,
	    id,
	    currentBulletCount = 1;

	var setCurrentBulletCount = function (newBulletCount) {
		currentBulletCount = newBulletCount;
	};

	var getCurrentBulletCount = function () {
		return currentBulletCount;
	};

	var setX = function (newX) {
		x = newX;
	};

	var setY = function (newY) {
		y = newY;
	};

	var setDir = function (newDir) {
		dir = newDir;
	};

	var getX = function () {
		return x;
	};

	var getY = function () {
		return y;
	};

	var getDir = function () {
		return dir;
	};

	var getColor = function () {
		return color;
	};

	var update = function (keys) {
		var prevX = x,
		    prevY = y;

		if (!keys.space && isShooting) {
			isShooting = false;
			var rtn = {
				command: "player shoots",
				x: x,
				y: y,
				dir: dir,
				size: currentBulletSize
			};
			currentBulletSize = 0;
			currentBulletCount = currentBulletCount - 1;
			return rtn;
		}

		if (keys.space) {
			if (currentBulletCount > 0) {
				isShooting = true;
				if (currentBulletSize < Constants.bulletMaxSize) {
					currentBulletSize += Constants.bulletGrowthRate;
				}
			}
		} else {
			if (keys.up) {
				dir = [0, -1];
			}
			if (keys.down) {
				dir = [0, 1];
			};
			if (keys.left) {
				dir = [-1, 0];
			}
			if (keys.right) {
				dir = [1, 0];
			};

			if (!Collisions.hasHitBoundary(x, y, dir, Constants.playerSpeed, Constants.playerSize)) {
				x = x + dir[0] * Constants.playerSpeed;
				y = y + dir[1] * Constants.playerSpeed;
			}

			if (prevX != x || prevY != y) {
				return { command: "move player", x: x, y: y, dir: dir };
			}
		}

		return null;
	};

	var draw = function (ctx) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, Constants.playerSize, 0, 2 * Math.PI);
		ctx.fill();
	};

	return {
		update: update,
		draw: draw,
		setX: setX,
		setY: setY,
		setDir: setDir,
		getX: getX,
		getY: getY,
		getDir: getDir,
		getColor: getColor,
		setCurrentBulletCount: setCurrentBulletCount,
		getCurrentBulletCount: getCurrentBulletCount,
		id: id
	};
};

exports.Player = Player;