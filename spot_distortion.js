let font;
let pg;

let tX, tY;
let maxDistortion = 200; // Maximum distortion amount
let distortionRadius = 500; // Radius of distortion effect

function setup() {
    let CanvasWidth = windowWidth;
    let CanvasHeight = windowHeight;
    createCanvas(CanvasWidth, CanvasHeight);
    pg = createGraphics(CanvasWidth, CanvasHeight);
    frameRate(60);

    tX = 60; // Number of tiles in X direction
    tY = 60; // Number of tiles in Y direction
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

    let tilesX = tX;
    let tilesY = tY;

    let tileW = int(width/tilesX);
    let tileH = int(height/tilesY);

    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            let tileCenter = createVector(x * tileW + tileW / 2, y * tileH + tileH / 2);
            let mousePos = createVector(mouseX, mouseY);
            let distToMouse = p5.Vector.dist(tileCenter, mousePos);
            
            // Create a smooth falloff
            let distortionFactor = map(distToMouse, 0, distortionRadius, 1, 0);
            distortionFactor = constrain(distortionFactor, 0, 1);
            distortionFactor = pow(distortionFactor, 3); // Non-linear falloff
            
            // Calculate angle between mouse and tile for directional distortion
            let angle = atan2(tileCenter.y - mouseY, tileCenter.x - mouseX);
            
            // Calculate distortion based on mouse position
            let distortionX = cos(angle) * maxDistortion * distortionFactor;
            let distortionY = sin(angle) * maxDistortion * distortionFactor;

            // SOURCE
            let sx = x * tileW + distortionX;
            let sy = y * tileH + distortionY;
            let sw = tileW;
            let sh = tileH;

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