/* =====================================================================
   main.js  --  THE STARTING LINE.

   This is the smallest file in the project and it runs last. All it
   does is: set up the screen, load the data files, build the first
   level, and start the loop.

   You will almost never need to change this file.
   ===================================================================== */

Draw.setup();

Level.loadData(function () {
  Game.startLevel(CONFIG.START_LEVEL);
  Game.loop();
});

// --- mouse: position and clicks --------------------------------------  
Draw.canvas.addEventListener("mousemove", function (event) {  
  var rect = Draw.canvas.getBoundingClientRect();  
  Input.mouseX = (event.clientX - rect.left) * (Draw.canvas.width / rect.width);  
  Input.mouseY = (event.clientY - rect.top) * (Draw.canvas.height / rect.height);  
});  

Draw.canvas.addEventListener("mousedown", function () {  
  Input.fire = true;   // a click is one press, so the press-edge works  
});  
Draw.canvas.addEventListener("mouseup", function () {  
  Input.fire = false;  
});  
