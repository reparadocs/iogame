//@flow
/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Commands = require('./Commands').Commands;
var Constants = require('./Constants').Constants;
var Globals = require('./Globals').Globals;

class Keys {
  _localPlayer: Object;
  _socket: Object;

  _space: boolean;
  _mouseX: number;
  _mouseY: number;
  _dir: ?Array<number>;

  _init: boolean;

  constructor(localPlayer: Object, socket: Object) {
    this._localPlayer = localPlayer;
    this._socket = socket;
    this._space = false;
    this._dir = null;
    this._mouseX = 0;
    this._mouseY = 0;
    this._init = false;
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
    };
  }

  onKeyUp(e: Object) {
    const c: number = e.keyCode;
    switch (c) {
      case 32: // Space
      this._space = false;
      Commands.shoot(this._localPlayer, Date.now(), this._socket);
      break;
    };
  }

  onMouseMove(e: Object) {
    this._mouseX = e.clientX;
    this._mouseY = e.clientY;
    const diffX = this._mouseX - Globals.playerCanvasX
    const diffY = this._mouseY - Globals.playerCanvasY
    const length = Math.sqrt(diffX * diffX + diffY * diffY);
    const vector = [diffX / length, diffY / length];
    this._dir = vector;
  }

  onMouseClick(e: Object) {
    if (
      !this._init
      && this._mouseX > Globals.playButtonXStart
      && this._mouseX < Globals.playButtonXStart + Globals.playButtonXSize
      && this._mouseY > Globals.playButtonYStart
      && this._mouseY < Globals.playButtonYStart + Globals.playButtonYSize
    ) {
      this._init = true;
    };
  }

  isPlayerOnMouse() {
    return Math.abs(this._mouseX - Globals.playerCanvasX) < Constants.mouseTolerance
    && Math.abs(this._mouseY - Globals.playerCanvasY) < Constants.mouseTolerance;
  }

  update() {
    if (this.isPlayerOnMouse() && (this._localPlayer.getDir()[0] !== 0 || this._localPlayer.getDir()[1] !== 0)) {
      Commands.stopPlayer(this._localPlayer, this._socket);
      //Commands.changeDir(this._localPlayer, 0, 0, this._socket);
    }

    if (this._dir) {
      Commands.changeDir(this._localPlayer, this._dir[0], this._dir[1], this._socket);
      this._dir = null;
    }
  }
}

exports.Keys = Keys;
