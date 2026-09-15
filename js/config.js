/* =====================================================================
   config.js  --  ALL THE NUMBERS.

   This is the first file to open if you want to change how the game
   FEELS. Every number here is safe to change. Change one at a time and
   play the game after each change.
   ===================================================================== */

var CONFIG = {

  // --- the world grid -------------------------------------------------
  TILE: 40,           // how many pixels wide and tall one grid square is
  ROWS: 10,           // how many rows tall every level piece is
  PIECE_COLS: 8,      // how many columns wide every level piece is

  // --- the screen -----------------------------------------------------
  CANVAS_W: 800,
  CANVAS_H: 400,

  // --- how the player moves -------------------------------------------
  MOVE_SPEED: 4,      // pixels per frame left and right
  JUMP_POWER: 15,     // how hard the jump pushes UP. bigger = higher
  GRAVITY: 0.8,       // how hard the world pulls DOWN. bigger = heavier
  MAX_FALL: 16,       // fastest the player is allowed to fall

  // --- the player's size ----------------------------------------------
  PLAYER_SIZE: 32,    // the player collides as a 32x32 box
  PLAYER_RADIUS: 16,  // ...but is DRAWN as a circle this big

  // --- drawing --------------------------------------------------------
  LINE_WIDTH: 3,      // thickness of every black outline
  DOT_DISTANCE: 0.55, // how far the off-center dot sits from the middle
                      // 0 = dead center, 1 = right on the edge

  // --- rules ----------------------------------------------------------
  START_LEVEL: 0      // which level in data/levels.json to load first
};

 DASH_SPEED: 14,            // pixels per frame during a dash  
  DASH_FRAMES: 10,           // how long a dash lasts (about 0.15 sec)  
  DASH_COOLDOWN_FRAMES: 180, // 3 seconds at 60 frames per second  
  DASH_RANGE: 150,           // how close an enemy must be to dash  
  ENEMY_SPEED: 1,            // enemy pixels per frame  
  ENEMY_CHASE_RANGE: 5       // tiles before an enemy starts chasing 

