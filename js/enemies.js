// =====================================================================  
// enemies.js -- enemies that wander, chase, and die to your dash  
// =====================================================================  
var Enemies = {  
  list: [],       // every alive enemy  
  pops: [],       // pop effect particles  
  dashState: "ready",   // "ready", "dashing", "cooldown"  
  dashDir: 0,     // -1 left, 1 right  
  dashFrames: 0,  // frames of dash left  
  cooldown: 0,    // frames of cooldown left  
  qWasDown: false,  
  eWasDown: false,  
  sound: null  
};  
  
// find every "e" in the level and turn it into an enemy  
Enemies.reset = function () {  
  Enemies.list = [];  
  Enemies.pops = [];  
  Enemies.dashState = "ready";  
  Enemies.dashFrames = 0;  
  Enemies.cooldown = 0;  
  for (var row = 0; row < CONFIG.ROWS; row++) {  
    for (var col = 0; col < Level.cols; col++) {  
      if (Level.charAt(col, row) === "e") {  
        Enemies.list.push({  
          x: col * CONFIG.TILE + 4,  
          y: row * CONFIG.TILE + 8,  
          size: CONFIG.TILE - 8,  
          dir: 1,  
          state: "wander" // "wander" or "chase"  
        });  
      }  
    }  
  }  
};  
  
// one-shot pop sound using plain browser audio, no files needed  
Enemies.playPop = function () {  
  if (!Enemies.sound) {  
    Enemies.sound = new AudioContext();  
  }  
  var osc = Enemies.sound.createOscillator();  
  var gain = Enemies.sound.createGain();  
  osc.type = "square";  
  osc.frequency.setValueAtTime(600, Enemies.sound.currentTime);  
  osc.frequency.exponentialRampToValueAtTime(80, Enemies.sound.currentTime + 0.15);  
  gain.gain.setValueAtTime(0.15, Enemies.sound.currentTime);  
  gain.gain.exponentialRampToValueAtTime(0.001, Enemies.sound.currentTime + 0.15);  
  osc.connect(gain);  
  gain.connect(Enemies.sound.destination);  
  osc.start();  
  osc.stop(Enemies.sound.currentTime + 0.16);  
};  
  
// little black burst where the enemy died  
Enemies.spawnPop = function (x, y) {  
  for (var i = 0; i < 10; i++) {  
    Enemies.pops.push({  
      x: x,  
      y: y,  
      vx: (Math.random() - 0.5) * 8,  
      vy: (Math.random() - 0.5) * 8 - 2,  
      life: 20  
    });  
  }  
};  
  
Enemies.startDash = function (dir) {  
  Enemies.dashState = "dashing";  
  Enemies.dashDir = dir;  
  Enemies.dashFrames = CONFIG.DASH_FRAMES;  
};  
  
Enemies.update = function () {  
  var size = CONFIG.PLAYER_SIZE;  
  var i, enemy;  
  
  // --- the dash state machine ----------------------------------------  
  var qJustPressed = Input.q && !Enemies.qWasDown;  
  var eJustPressed = Input.e && !Enemies.eWasDown;  
  Enemies.qWasDown = Input.q;  
  Enemies.eWasDown = Input.e;  
  
  if (Enemies.dashState === "ready") {  
    if (qJustPressed && Enemies.enemyNear(-1)) {  
      Enemies.startDash(-1);  
    } else if (eJustPressed && Enemies.enemyNear(1)) {  
      Enemies.startDash(1);  
    }  
  } else if (Enemies.dashState === "dashing") {  
    // move the player fast, one pixel at a time, stopping at walls  
    for (var step = 0; step < CONFIG.DASH_SPEED; step++) {  
      if (Collide.hitsSolid(Player.x + Enemies.dashDir, Player.y, size, size)) {  
        break; // wall stops the dash  
      }  
      Player.x = Player.x + Enemies.dashDir;  
    }  
    // kill any enemy we touch  
    for (i = Enemies.list.length - 1; i >= 0; i--) {  
      enemy = Enemies.list[i];  
      if (Enemies.overlap(Player.x, Player.y, size, size, enemy)) {  
        Enemies.spawnPop(enemy.x + enemy.size / 2, enemy.y + enemy.size / 2);  
        Enemies.playPop();  
        Enemies.list.splice(i, 1);  
      }  
    }  
    Enemies.dashFrames = Enemies.dashFrames - 1;  
    if (Enemies.dashFrames <= 0) {  
      Enemies.dashState = "cooldown";  
      Enemies.cooldown = CONFIG.DASH_COOLDOWN_FRAMES;  
    }  
  } else if (Enemies.dashState === "cooldown") {  
    Enemies.cooldown = Enemies.cooldown - 1;  
    if (Enemies.cooldown <= 0) {  
      Enemies.dashState = "ready";  
    }  
  }  
  
  // --- enemies: wander or chase --------------------------------------  
  for (i = 0; i < Enemies.list.length; i++) {  
    enemy = Enemies.list[i];  
    var distance = Math.abs((Player.x + size / 2) - (enemy.x + enemy.size / 2));  
    if (distance < CONFIG.ENEMY_CHASE_RANGE * CONFIG.TILE) {  
      enemy.state = "chase";  
      // run toward the player  
      enemy.dir = Player.x > enemy.x ? 1 : -1;  
    } else {  
      enemy.state = "wander";  
    }  
    for (var s = 0; s < CONFIG.ENEMY_SPEED; s++) {  
      if (Collide.hitsSolid(enemy.x + enemy.dir, enemy.y, enemy.size, enemy.size)) {  
        enemy.dir = -enemy.dir; // turn around at walls  
        break;  
      }  
      enemy.x = enemy.x + enemy.dir;  
    }  
e  }  
  
  // --- pop particles --------------------------------------------------  
  for (i = Enemies.pops.length - 1; i >= 0; i--) {  
    var p = Enemies.pops[i];  
    p.x = p.x + p.vx;  
    p.y = p.y + p.vy;  
    p.vy = p.vy + 0.4;  
    p.life = p.life - 1;  
    if (p.life <= 0) {  
      Enemies.pops.splice(i, 1);  
    }  
  }  
};  
  
// is there an alive enemy within dash range in this direction?  
Enemies.enemyNear = function (dir) {  
  var size = CONFIG.PLAYER_SIZE;  
  for (var i = 0; i < Enemies.list.length; i++) {  
    var enemy = Enemies.list[i];  
    var dx = (enemy.x + enemy.size / 2) - (Player.x + size / 2);  
    if (dir === 1 && dx > 0 && dx < CONFIG.DASH_RANGE) {  
      return true;  
    }  
    if (dir === -1 && dx < 0 && dx > -CONFIG.DASH_RANGE) {  
      return true;  
    }  
  }  
  return false;  
};  
  
Enemies.overlap = function (x, y, w, h, enemy) {  
  return x < enemy.x + enemy.size && x + w > enemy.x &&  
         y < enemy.y + enemy.size && y + h > enemy.y;  
};  
  
Enemies.draw = function () {  
  var ctx = Draw.ctx;  
  // enemies: black circle with a white eye dot  
  for (var i = 0; i < Enemies.list.length; i++) {  
    var enemy = Enemies.list[i];  
    var cx = enemy.x + enemy.size / 2;  
    var cy = enemy.y + enemy.size / 2;  
    ctx.beginPath();  
    ctx.arc(cx, cy, enemy.size / 2, 0, Math.PI * 2);  
    ctx.fillStyle = "#000000";  
    ctx.fill();  
    // eye turns toward the player when chasing  
    ctx.beginPath();  
    ctx.arc(cx + enemy.dir * 5, cy - 3, 4, 0, Math.PI * 2);  
    ctx.fillStyle = "#FFFFFF";  
    ctx.fill();  
  }  
  // pop particles  
  ctx.fillStyle = "#000000";  
  for (var j = 0; j < Enemies.pops.length; j++) {  
    var p = Enemies.pops[j];  
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);  
  }  
  // cooldown bar under the player so you can see when dash is back  
  if (Enemies.dashState === "cooldown") {  
    var ratio = 1 - (Enemies.cooldown / CONFIG.DASH_COOLDOWN_FRAMES);  
    ctx.fillStyle = "#000000";  
    ctx.fillRect(Player.x, Player.y + CONFIG.PLAYER_SIZE + 4,  
                 CONFIG.PLAYER_SIZE * ratio, 4);  
  }  
};  
