/* =====================================================================
   game.js  --  THE RULES AND THE LOOP.

   The game is always in exactly ONE mode: "playing", "dead", or "won".
   Which mode it is in decides what happens each frame.

   The loop runs about 60 times a second, forever. Every time it runs it
   does the same two things: UPDATE (change the numbers) and DRAW (show
   the numbers).
   ===================================================================== */

var Game = {
  mode: "playing",   // "playing", "dead", or "won"
  levelNumber: 0
};

Game.startLevel = function (levelNumber) {
  Game.levelNumber = levelNumber;
  Level.build(levelNumber);
  Enemies.reset();  
  Blaster.reset();
  Player.reset();
  Game.mode = "playing";
  Game.showMessage("");
};

// --- level randomizer: keep start and finish, shuffle the middle ----  
Game.shuffleLevel = function (levelNumber) {  
  var pieces = Level.levels[levelNumber].pieces;  
  // only shuffle the pieces between the first and the last  
  var middle = pieces.slice(1, pieces.length - 1);  
  // Fisher-Yates shuffle: walk backwards and swap with a random earlier spot  
  for (var i = middle.length - 1; i > 0; i--) {  
    var j = Math.floor(Math.random() * (i + 1));  
    var temp = middle[i];  
    middle[i] = middle[j];  
    middle[j] = temp;  
  }  
  // glue start + shuffled middle + finish back together  
  Level.levels[levelNumber].pieces = [pieces[0]].concat(middle, [pieces[pieces.length - 1]]);  
};  


Game.showMessage = function (text) {
  document.getElementById("message").textContent = text;
};

// --- ONE FRAME --------------------------------------------------------
Game.update = function () {

  // R always restarts, no matter what mode we are in.
  if (Input.restart) {
    Game.startLevel(Game.levelNumber);
    return;
  }

  // If we are not playing, nothing moves. We just wait for R.
  if (Game.mode !== "playing") { return; }

  Player.update();
  Enemies.update(); 
  Blaster.update();

  if (Player.isDead()) {
    Game.mode = "dead";
    Game.showMessage("You died! Press R to restart");
    return;
  }

  if (Player.hasWon()) {
    Game.mode = "won";
    Game.showMessage("You won! press R to restart.");
    return;
  }
};

// --- THE LOOP ITSELF --------------------------------------------------
Game.loop = function () {
  Game.update();
  Draw.updateCamera();
  Draw.everything();
  window.requestAnimationFrame(Game.loop);
};
