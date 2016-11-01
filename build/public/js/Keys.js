
/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Commands = require('./Commands').Commands;

class Keys {

	constructor(localPlayer, socket) {
		this._localPlayer = localPlayer;
		this._socket = socket;
		this._fired = true;
	}

	onKeyDown(e) {
		const c = e.keyCode;
		switch (c) {
			case 32:
				// Space
				if (this._fired) {
					this._fired = false;
					Commands.chargeShot(this._localPlayer, Date.now(), this._socket);
				}
				break;
			case 37:
				// Left
				Commands.changeDirection(this._localPlayer, -1, 0, this._socket);
				break;
			case 38:
				// Up
				Commands.changeDirection(this._localPlayer, 0, -1, this._socket);
				break;
			case 39:
				// Right
				Commands.changeDirection(this._localPlayer, 1, 0, this._socket);
				break;
			case 40:
				// Down
				Commands.changeDirection(this._localPlayer, 0, 1, this._socket);
				break;
		};
	}

	onKeyUp(e) {
		const c = e.keyCode;
		switch (c) {
			case 32:
				// Space
				this._fired = true;
				Commands.shoot(this._localPlayer, Date.now(), this._socket);
				break;
		};
	}
}

exports.Keys = Keys;