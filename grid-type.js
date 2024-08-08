let font;
let pg;

let tX,tY,sp,dispX,dispY,offst;

// Setup Canvas
function setup() {
    let CanvasWidth = windowWidth;
    let CanvasHeight = windowHeight;
    createCanvas(CanvasWidth, CanvasHeight);
    createSliders();
    pg = createGraphics(CanvasWidth, CanvasHeight);
    frameRate(30);
}

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


  let tilesX = tX.value();
  let tilesY = tY.value();

  let tileW = int(width/tilesX);
  let tileH = int(height/tilesY);

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      // WARP
      let waveX = int(sin(frameCount * sp.value() + ( x * y ) * dispX.value()) * offst.value());
      let waveY = int(sin(frameCount * sp.value() + ( x * y ) * dispY.value()) * offst.value());

      if (dispX.value() === 0){
          waveX = 0;
      }

      if (dispY.value() === 0){
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

/* NOT NEEDED IN FULLSCREEN
function createSliders(){
  tX = createSlider(1, 80, 16, 1);
  tX.position(20, height + 40);
  createP('Tiles X').position(20, height);

  tY = createSlider(1, 80, 16, 1);
  tY.position(20, height + 100);
  createP('Tiles Y').position(20, height+60);

  sp = createSlider(0, 1, 0.005, 0.01);
  sp.position(20, height + 160);
  createP('Speed').position(20, height+120);

  dispX = createSlider(0, 0.1, 0.05, 0.001);
  dispX.position(180, height + 40);
  createP('Displacement X').position(180, height);

  dispY = createSlider(0, 0.2, 0, 0.01);
  dispY.position(180, height + 100);
  createP('Displacement Y').position(180, height+60);

  offst = createSlider(0, 300, 100, 1);
  offst.position(180, height + 160);
  createP('Offset').position(180, height+120);
} */