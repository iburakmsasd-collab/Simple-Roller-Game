// =====================================================================
// blaster.js -- a power-up hidden in secret places: 10 big AoE shots
// =====================================================================
var Blaster = {
x: 0, // pickup position in pixels (0,0 means "not on the map")
y: 0,
taken: true, // true until the player touches it
shots: 0, // shots left in the blaster
cooldown: 0, // frames until the next shot is allowed
fireWasDown: false,
spin: 0,         // angle of the orbiting blaster  
blastTimer: 0,   // frames the blast effect stays visible  
blastX: 0,  
blastY: 0,  
bullets: []  


};

// find every "b" in the level and turn it into a pickup
Blaster.reset = function () {
Blaster.taken = true;
Blaster.shots = 0;
Blaster.cooldown = 0;
for (var row = 0; row < CONFIG.ROWS; row++) {
for (var col = 0; col < Level.cols; col++) {
if (Level.charAt(col, row) === "b") {
Blaster.x = col * CONFIG.TILE;
Blaster.y = row * CONFIG.TILE;
Blaster.taken = false;
// clear the "b" from the grid so nothing solid gets drawn there
var line = Level.grid[row];
Level.grid[row] = line.substring(0, col) + "." + line.substring(col + 1);
}
}
}
  // remember where each enemy started, so dead ones can respawn  
  for (var i = 0; i < Enemies.list.length; i++) {  
    Enemies.list[i].homeX = Enemies.list[i].x;  
    Enemies.list[i].homeY = Enemies.list[i].y;  
    Enemies.list[i].respawnTimer = 0;  
  }  

};

// fire one AoE shot if we can
Blaster.tryFire = function () {
if (Blaster.shots <= 0 || Blaster.cooldown > 0) { return; }
Blaster.shots = Blaster.shots - 1;
Blaster.cooldown = CONFIG.BLASTER_COOLDOWN_FRAMES;
  Blaster.blastTimer = CONFIG.BLAST_FRAMES;  
  Blaster.blastX = px;  
  Blaster.blastY = py;  
var px = Player.x + CONFIG.PLAYER_SIZE / 2;  
  var py = Player.y + CONFIG.PLAYER_SIZE / 2;  
  var mx = Input.mouseX + Draw.cameraX;  
  var my = Input.mouseY;  

    // spawn a bullet flying toward the mouse  
  var bdx = mx - px;  
  var bdy = my - py;  
  var blength = Math.sqrt(bdx * bdx + bdy * bdy);  
  if (blength > 0) {  
    Blaster.bullets.push({  
      x: px,  
      y: py,  
      vx: (bdx / blength) * CONFIG.BULLET_SPEED,  
      vy: (bdy / blength) * CONFIG.BULLET_SPEED,  
      life: CONFIG.BULLET_LIFE_FRAMES  
    });  
  }  


// blast every enemy inside the radius
var px = Player.x + CONFIG.PLAYER_SIZE / 2;
var py = Player.y + CONFIG.PLAYER_SIZE / 2;
};

Blaster.update = function () {
  // spin the blaster around the player  
  // blast effect fades out  
  if (Blaster.blastTimer > 0) {  
    Blaster.blastTimer = Blaster.blastTimer - 1;  
  }  
  // move bullets; kill them when they expire or hit an enemy  
  for (var i = Blaster.bullets.length - 1; i >= 0; i--) {  
    var b = Blaster.bullets[i];  
    b.x = b.x + b.vx;  
    b.y = b.y + b.vy;  
    b.life = b.life - 1;  
    // check every alive enemy for a hit  
    var hit = -1;  
    for (var e = 0; e < Enemies.list.length; e++) {  
      var enemy = Enemies.list[e];  
      if (enemy.respawnTimer > 0) { continue; }  
      if (b.x > enemy.x && b.x < enemy.x + enemy.size &&  
          b.y > enemy.y && b.y < enemy.y + enemy.size) {  
        hit = e;  
        break;  
      }  
    }  
    if (hit >= 0) {  
      var target = Enemies.list[hit];  
      Enemies.spawnPop(target.x + target.size / 2, target.y + target.size / 2);  
      Enemies.playPop();  
      target.respawnTimer = CONFIG.ENEMY_RESPAWN_FRAMES;  
      Blaster.bullets.splice(i, 1); // bullet dies on impact  
      continue;  
    }  
    if (b.life <= 0) {  
      Blaster.bullets.splice(i, 1);  
    }  
  }  



// cooldown ticks down every frame
if (Blaster.cooldown > 0) {
Blaster.cooldown = Blaster.cooldown - 1;
}
// act only on the key PRESS, not the held key
var fireJustPressed = Input.fire && !Blaster.fireWasDown;
if (fireJustPressed) {
Blaster.tryFire();
}
Blaster.fireWasDown = Input.fire;
// pick up the blaster by touching it
if (!Blaster.taken) {
var size = CONFIG.PLAYER_SIZE;
var hit = Player.x < Blaster.x + CONFIG.TILE &&
Player.x + size > Blaster.x &&
Player.y < Blaster.y + CONFIG.TILE &&
Player.y + size > Blaster.y;
if (hit) {
Blaster.taken = true;
Blaster.shots = CONFIG.BLASTER_SHOTS;
Game.showMessage("BLASTER! " + CONFIG.BLASTER_SHOTS + " ammo, click to fire");
}
}
};

Blaster.draw = function () {  
  var ctx = Draw.ctx;  
  // the pickup: a diagonal stick, floating where you placed the "b"  
  if (!Blaster.taken) {  
    ctx.strokeStyle = "#000000";  
    ctx.lineWidth = CONFIG.LINE_WIDTH;  
    ctx.beginPath();  
    ctx.moveTo(Blaster.x + 10, Blaster.y + CONFIG.TILE - 10);  
    ctx.lineTo(Blaster.x + CONFIG.TILE - 10, Blaster.y + 10);  
    ctx.stroke();  
  }  
  // held blaster: a stick from the player pointing at the mouse.  
  // mouse coords are screen coords, so add the camera back to get world coords  
  // held blaster: a stick orbiting the player's edge, pointing outward  
  // held blaster: sits on the player's edge, points at the mouse  
  if (Blaster.shots > 0) {  
    var px = Player.x + CONFIG.PLAYER_SIZE / 2;  
    var py = Player.y + CONFIG.PLAYER_SIZE / 2;  
    var mx = Input.mouseX + Draw.cameraX;  
    var my = Input.mouseY;  
    var dx = mx - px;  
    var dy = my - py;  
    var length = Math.sqrt(dx * dx + dy * dy);  
    if (length > 0) {  
      dx = dx / length;  
      dy = dy / length;  
      var ox = px + dx * (CONFIG.PLAYER_RADIUS + 4);  
      var oy = py + dy * (CONFIG.PLAYER_RADIUS + 4);  
      ctx.strokeStyle = "#000000";  
      ctx.lineWidth = CONFIG.LINE_WIDTH;  
      ctx.beginPath();  
      ctx.moveTo(ox - dx * 8, oy - dy * 8);  
      ctx.lineTo(ox + dx * 16, oy + dy * 16);  
      ctx.stroke();  
    }  
  }  
 
  // the blast: an expanding ring that fades away  
  if (Blaster.blastTimer > 0) {  
    var progress = 1 - Blaster.blastTimer / CONFIG.BLAST_FRAMES;  
    var radius = progress * CONFIG.BLASTER_RADIUS * CONFIG.TILE;  
    ctx.strokeStyle = "#000000";  
    ctx.lineWidth = 3;  
    ctx.beginPath();  
    ctx.arc(Blaster.blastX, Blaster.blastY, radius, 0, Math.PI * 2);  
    ctx.stroke();  
  }  

    // bullets: small black dots flying through the air  
  for (var j = 0; j < Blaster.bullets.length; j++) {  
    var b = Blaster.bullets[j];  
    ctx.fillStyle = "#000000";  
    ctx.beginPath();  
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);  
    ctx.fill();  
  }  


};  


// blaster ammo counter, fixed on screen
if (Blaster.shots > 0) {
Draw.ctx.fillStyle = "#000000";
Draw.ctx.font = "16px monospace";
Draw.ctx.fillText("SHOTS: " + Blaster.shots, 10, 20);
}