//@flow
/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Commands = require('./Commands').Commands;

class Keys {
	_localPlayer: Object;
	_socket: Object;

	_space: boolean;
	_left: boolean;
	_right: boolean;
	_up: boolean;
	_down: boolean;

	constructor(localPlayer: Object, socket: Object) {
		this._localPlayer = localPlayer;
		this._socket = socket;
		this._space = false;
		this._left = false;
		this._right = false;
		this._up = false;
		this._down = false;
	}

	onKeyDown(e: Object) {
		const c: number = e.keyCode;
		switch (c) {
			case 32: // Space
				if (!this._space) {
					this._space = true;
					Commands.chargeShot(this._localPlayer, Date.now(), this._socket);
				}
				break;
			case 37: // Left
				this._left = true;
				break;
			case 38: // Up
				this._up = true;
				break;
			case 39: // Right
				this._right = true;
				break;
			case 40: // Down
				this._down = true;
				break;
		};
	}

	onKeyUp(e: Object) {
		const c: number = e.keyCode;
		switch (c) {
			case 32: // Space
				this._space = false;
				Commands.shoot(this._localPlayer, Date.now(), this._socket);
				break;
			case 37: // Left
				this._left = false;
				break;
			case 38: // Up
				this._up = false;
				break;
			case 39: // Right
				this._right = false;
				break;
			case 40: // Down
				this._down = false;
				break;

		};
	}

	update() {
		if (this._up) {
			Commands.move(this._localPlayer, 0, -1, this._socket);
		} else if (this._down) {
			Commands.move(this._localPlayer, 0, 1, this._socket);
		} else if (this._right) {
			Commands.move(this._localPlayer, 1, 0, this._socket);
		} else if (this._left) {
			Commands.move(this._localPlayer, -1, 0, this._socket);
		}
	}
}

exports.Keys = Keys;
