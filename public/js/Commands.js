//@flow
class Commands{
  static move(player: Object, xMove: number, yMove: number, socket: ?Object = null) {
    player.setMove([xMove, yMove]);
    if (socket) {
      socket.emit("move player", {xMove: xMove, yMove: yMove});
    }
  }

  static chargeShot(player: Object, time: number, socket: ?Object = null) {
    player.chargeShot(time);
    if (socket) {
      socket.emit("player charges shot", {time: time});
    }
  }

  static shoot(player: Object, time: number, socket: ?Object = null) {
    player.shoot(time);
    if (socket) {
      socket.emit("player shoots", {time: time});
    }
  }
}

exports.Commands = Commands;
