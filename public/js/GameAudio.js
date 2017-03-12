
var ResourceAudio = [];
var ShootAudio = [];
var DamageAudio = [];
for (var i = 0; i < 10; i++) {
  ResourceAudio.push(new Audio("/resource.wav"));
  ShootAudio.push(new Audio("/shoot.wav"));
  DamageAudio.push(new Audio("/damage.wav"));
}
var resourceCounter = 0;
var damageCounter = 0;
var shootCounter = 0;

class GameAudio {
  static playResource() {
    ResourceAudio[resourceCounter].play()
    resourceCounter += 1;
    if (resourceCounter >= 10) {
      resourceCounter = 0;
    }
  }

  static playShoot() {
    ShootAudio[shootCounter].play()
    shootCounter += 1;
    if (shootCounter >= 10) {
      shootCounter = 0;
    }
  }

  static playDamage() {
    DamageAudio[damageCounter].play()
    damageCounter += 1;
    if (damageCounter >= 10) {
      damageCounter = 0;
    }
  }
}

exports.GameAudio = GameAudio;
