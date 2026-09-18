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
  Game.buildRandomLevel();  
  Level.build(levelNumber);  
  Enemies.reset();  
  Blaster.reset();  
  Player.reset();  
  Game.mode = "playing";  
  Game.showMessage("");  
};  


// --- level randomizer: start and finish fixed, middle shuffled ------  
// rule: the piece after the start must be flat, so you never spawn into danger  
Game.shuffleLevel = function (levelNumber) {  
  var pieces = Level.levels[levelNumber].pieces;  
  var middle = pieces.slice(1, pieces.length - 1);  
  // Fisher-Yates shuffle: walk backwards, swap with a random earlier spot  
  for (var i = middle.length - 1; i > 0; i--) {  
    var j = Math.floor(Math.random() * (i + 1));  
    var temp = middle[i];  
    middle[i] = middle[j];  
    middle[j] = temp;  
  }  
  // find a safe piece to sit right after the start  
  var safeIndex = -1;  
  for (var k = 0; k < middle.length; k++) {  
    if (middle[k] === "flat") {  
      safeIndex = k;  
      break;  
    }  
  }  
  // if we found one, move it to the front of the middle  
  if (safeIndex > 0) {  
    var safe = middle[safeIndex];  
    middle.splice(safeIndex, 1);  
    middle.unshift(safe);  
  }  
  Level.levels[levelNumber].pieces = [pieces[0]].concat(middle, [pieces[pieces.length - 1]]);  
};  


// --- build a random level from the piece pool, using the slider length ----  
Game.buildRandomLevel = function () {  
  var pool = ["spikes", "enemy", "platformmiddle", "stairsup",  
              "platformstart", "platformmiddlespikes", "platformend",  
              "stairsdown", "step", "enemies", "spikepit"];  
  var safe = "flat";  
  var length = Game.levelLength;  
  var pieces = ["start", safe];  
  for (var i = 2; i < length - 1; i++) {  
    // never put a spike piece right after another spike piece  
    var pick = pool[Math.floor(Math.random() * pool.length)];  
    var lastWasSpikes = (pieces[i - 1] === "platformmiddlespikes" || pieces[i - 1] === "spikepit");  
    if (lastWasSpikes && pick === "spikes") { pick = safe; }  
    pieces.push(pick);  
  }  
  pieces.push("finish");  
  // swap it into the level list, replacing whatever was there  
  Level.levels[Game.levelNumber].pieces = pieces;  
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
    Blaster.shots = 0; // dying costs you the blaster  
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

// --- length slider ----------------------------------------------------  
Game.levelLength = 12;  
var slider = document.getElementById("lengthSlider");  
if (slider) {  
  slider.addEventListener("input", function () {  
    Game.levelLength = Number(slider.value);  
    document.getElementById("lengthValue").textContent = slider.value;  
  });  
}  

