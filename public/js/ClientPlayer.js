//@flow
var Player = require('./Player').Player;
var Constants = require('./Constants').Constants;
var hash = require('object-hash');

class ClientPlayer extends Player {
  _history: Array<string>;
  _offset: number;
  _borders: Array<Object>;

  constructor(startX: number, startY: number, dir: Array<number>, color: string, createBullet: Function) {
    super(startX, startY, dir, color, createBullet);
    this._history = [];
    this._offset = 0;
  }

  update(borders: Array<Object>) {
    console.log("Here");
    this._borders = borders;
    super.update(borders);
    this._history.push(this.hash(this.serialize()));
    if (this._history.length > Constants.maxHistoryBuffer) {
      this._history = this._history.splice(-Constants.maxHistoryBuffer);
    }
  }

  hash(data: Object) {
    const dir = data.dir
    data.dir = 0;
    const result = hash(data);
    data.dir = dir;
    return result;
  }

  synchronize(data: Object) {
    if (data.frame < this._offset) {
      // We already know we are in sync for this frame
      return;
    }
    if (this._history.length + this._offset <= data.frame) {
      // We haven't processed this frame yet
      this._history = [this.hash(data.serialized),];
      this._offset = data.frame;
      this.applyUpdate(data.serialized);
    }
    const serverFrameState = this.hash(data.serialized);
    const clientFrameState = this._history[data.frame - this._offset];
    if (serverFrameState === clientFrameState) {
      // We are in sync for this frame
      this._history = this._history.slice(data.frame - this._offset + 1);
      this._offset = data.frame;
      return;
    } else {
      console.log(data.frame);
      console.log(this._offset);
      console.log(serverFrameState);
      console.log(clientFrameState);
      console.log(data.frame - this._offset);
      console.log(this._history[data.frame - this._offset]);
      console.log(this.hash(this.serialize()));
      console.log(this._history);
      console.log("not in sync");
      // We are not in sync, fuck
      this.applyUpdate(data.serialized);
      const frameDiff = this._history.length + this._offset - data.frame;
      for (var i = 0; i < frameDiff; i++) {
        // Fastforward to get current state
        //this.update(this._borders);
      }
    }
  }

  applyUpdate(data: Object) {
    super.applyUpdate(data);
    this._dir = data.dir;
    if (data.dir[0] !== 0 || data.dir[1] !== 0) {
      this._shootDir = data.dir;
    }
    this._bulletCount = data.bulletCount;
    this._score = data.score;
  }
}

exports.ClientPlayer = ClientPlayer;
