class Commands {
  static changeDirection(player, xDir, yDir, socket = null) {
    player.setDir([xDir, yDir]);
    if (socket) {
      socket.emit("change player direction", { xDir: xDir, yDir: yDir });
    }
  }

  static chargeShot(player, time, socket = null) {
    player.chargeShot(time);
    if (socket) {
      socket.emit("player charges shot", { time: time });
    }
  }

  static shoot(player, time, socket = null) {
    player.shoot(time);
    if (socket) {
      socket.emit("player shoots", { time: time });
    }
  }
}

exports.Commands = Commands;