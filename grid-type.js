let font;
let pg;

let tX, tY;
let maxDistortion = 20; // Maximum distortion amount
let noiseScale = 0.2; // Scale of the noise
let maxScaleFactor = 0.75; // Maximum scale reduction

// Setup Canvas
function setup() {
    let CanvasWidth = windowWidth;
    let CanvasHeight = windowHeight;
    createCanvas(CanvasWidth, CanvasHeight);
    pg = createGraphics(CanvasWidth, CanvasHeight);
    frameRate(60);

    // Define tiles
    tX = 60; // Number of tiles in X direction
    tY = 50; // Number of tiles in Y direction
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

    // Calculate global cursor influence
    let cursorInfluenceX = map(mouseX, 0, width, -1, 1);
    let cursorInfluenceY = map(mouseY, 0, height, -1, 1);

    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            // Generate noise value influenced by cursor position
            let noiseVal = noise(x * noiseScale + cursorInfluenceX, 
                                 y * noiseScale + cursorInfluenceY, 
                                 frameCount * 0.01);
            let noiseInfluence = map(noiseVal, 0, 1, -maxDistortion, maxDistortion);

            // Apply cursor influence and noise to the entire canvas
            let totalDistortionX = cursorInfluenceX * maxDistortion + noiseInfluence;
            let totalDistortionY = cursorInfluenceY * maxDistortion + noiseInfluence;

            // Calculate scale factor (only smaller, inverse to noise influence)
            let scaleFactor = map(abs(noiseInfluence), 0, maxDistortion, 1, maxScaleFactor);

            // SOURCE
            let sx = x * tileW + totalDistortionX;
            let sy = y * tileH + totalDistortionY;
            let sw = tileW * scaleFactor;
            let sh = tileH * scaleFactor;

            // DESTINATION
            let dx = x * tileW;
            let dy = y * tileH;
            let dw = tileW;
            let dh = tileH;
        
            // Draw Canvas
            image(pg, sx, sy, sw, sh, dx, dy, dw, dh);
        }
    }
}