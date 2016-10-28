/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		dir = [1,0],
		id;

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};

	var setDir = function(newDir) {
		dir = newDir;
	};

	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	}

	var getDir = function() {
		return dir;
	};

	var update = function(keys) {
		var prevX = x, prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= Constants.playerSpeed;
			dir = [0,-1];
		} else if (keys.down) {
			y += Constants.playerSpeed;
			dir = [0,1];
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= Constants.playerSpeed;
			dir = [-1, 0];
		} else if (keys.right) {
			x += Constants.playerSpeed;
			dir = [1, 0];
		};

		if (prevX != x || prevY != y) {
			return {command: "move player", x: x, y: y, dir: dir};
		} 

		if (keys.space) {
			return {command: "player shoots", x: x, y: y, dir: dir};
		}

		return null;
	};

	var draw = function(ctx) {
		ctx.fillRect(x-(Constants.playerSize / 2), y-(Constants.playerSize / 2), Constants.playerSize, Constants.playerSize);
	};

	return {
		update: update,
		draw: draw,
		setX: setX,
		setY: setY,
		setDir: setDir,
		getX: getX,
		getY: getY,
		getDir: getDir
	}
};

(function(exports){

  exports.Player = Player;

}(typeof exports === 'undefined' ? this.share = {} : exports));