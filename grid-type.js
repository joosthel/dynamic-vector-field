let font;
let pg;

let tX,tY,sp,dispX,dispY,offst;

// Setup Canvas
function setup() {
    let CanvasWidth = windowWidth;
    let CanvasHeight = windowHeight;
    createCanvas(CanvasWidth, CanvasHeight);
    pg = createGraphics(CanvasWidth, CanvasHeight);
    frameRate(30);

    // Define fixed values for variables || ART DIRECTION IN HERE
    tX = 60; // Number of tiles in X direction
    tY = 60; // Number of tiles in Y direction
    sp = 0.05; // Speed
    dispX = 0.05; // Displacement X
    dispY = 0.1; // Displacement Y
    offst = 20; // Offset
}

// Draw text and distortion on Canvas
function draw() {
  background('#000000');

  // PGraphics
  pg.background(0);
  pg.fill(255);
  pg.textSize(400);
  pg.push();
  pg.translate(width/2, height/2);
  pg.textAlign(CENTER, CENTER);
  pg.text("RDS", 0, 0);
  pg.pop();


  let tilesX = tX;
  let tilesY = tY;

  let tileW = int(width/tilesX);
  let tileH = int(height/tilesY);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      // WARP
      let waveX = int(sin(frameCount * sp + ( x * y ) * dispX) * offst);
      let waveY = int(sin(frameCount * sp + ( x * y ) * dispY) * offst);

      if (dispX === 0){
          waveX = 0;
      }

      if (dispY === 0){
          waveY = 0;
      }
      
      // SOURCE
      let sx = x*tileW + waveX;
      let sy = y*tileH + waveY;
      let sw = tileW;
      let sh = tileH;

      // DESTINATION
      let dx = x*tileW;
      let dy = y*tileH;
      let dw = tileW;
      let dh = tileH;
    
      // Draw Canvas
      image(pg, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }
}