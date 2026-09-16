// =====================================================================
// blaster.js -- a power-up hidden in secret places: 10 big AoE shots
// =====================================================================
var Blaster = {
x: 0, // pickup position in pixels (0,0 means "not on the map")
y: 0,
taken: true, // true until the player touches it
shots: 0, // shots left in the blaster
cooldown: 0, // frames until the next shot is allowed
fireWasDown: false
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
};

// fire one AoE shot if we can
Blaster.tryFire = function () {
if (Blaster.shots <= 0 || Blaster.cooldown > 0) { return; }
Blaster.shots = Blaster.shots - 1;
Blaster.cooldown = CONFIG.BLASTER_COOLDOWN_FRAMES;
// blast every enemy inside the radius
var px = Player.x + CONFIG.PLAYER_SIZE / 2;
var py = Player.y + CONFIG.PLAYER_SIZE / 2;
var radius = CONFIG.BLASTER_RADIUS * CONFIG.TILE;
for (var i = Enemies.list.length - 1; i >= 0; i--) {
var enemy = Enemies.list[i];
var ex = enemy.x + enemy.size / 2;
var ey = enemy.y + enemy.size / 2;
var dx = ex - px;
var dy = ey - py;
if (Math.sqrt(dx * dx + dy * dy) < radius) {
Enemies.spawnPop(ex, ey);
Enemies.playPop();
Enemies.list.splice(i, 1);
}
}
};

Blaster.update = function () {
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
Game.showMessage("BLASTER! " + CONFIG.BLASTER_SHOTS + " shots - press X");
}
}
};

// draws the pickup (until taken) and the shots left (when held)
Blaster.draw = function () {
var ctx = Draw.ctx;
if (!Blaster.taken) {
// the blaster on the ground: a black square with a white barrel dot
ctx.fillStyle = "#000000";
ctx.fillRect(Blaster.x + 8, Blaster.y + 8, CONFIG.TILE - 16, CONFIG.TILE - 16);
ctx.beginPath();
ctx.arc(Blaster.x + CONFIG.TILE / 2, Blaster.y + CONFIG.TILE / 2, 5, 0, Math.PI * 2);
ctx.fillStyle = "#FFFFFF";
ctx.fill();
}
// shots remaining, drawn after ctx.restore() so it stays on screen
};

// blaster ammo counter, fixed on screen
if (Blaster.shots > 0) {
Draw.ctx.fillStyle = "#000000";
Draw.ctx.font = "16px monospace";
Draw.ctx.fillText("SHOTS: " + Blaster.shots, 10, 20);
}