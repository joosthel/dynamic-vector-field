let font;
let pg;
let tX, tY;
let maxDistortion = 50; // Maximum distortion amount
let distortionRadius = 400; // Radius of distortion effect
let falloffPower = 5; // Increased from 3 to 5 for faster falloff
let noiseScale = 0.1; // Scale of the noise
let noiseStrength = 250; // Strength of the noise effect

function setup() {
    let CanvasWidth = windowWidth;
    let CanvasHeight = windowHeight;
    createCanvas(CanvasWidth, CanvasHeight);
    pg = createGraphics(CanvasWidth, CanvasHeight);
    frameRate(60);
    tX = 120; // Number of tiles in X direction
    tY = 120; // Number of tiles in Y direction
}

function draw() {
    background('#000000');
    // PGraphics
    pg.background(255);
    pg.fill(0);
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
            
            // Create a smoother, faster falloff
            let distortionFactor = map(distToMouse, 0, distortionRadius, 1, 0);
            distortionFactor = constrain(distortionFactor, 0, 1);
            distortionFactor = pow(distortionFactor, falloffPower); // Steeper non-linear falloff
            
            // Calculate angle between mouse and tile for directional distortion
            let angle = atan2(tileCenter.y - mouseY, tileCenter.x - mouseX);
            
            // Calculate distortion based on mouse position
            let distortionX = cos(angle) * maxDistortion * distortionFactor;
            let distortionY = sin(angle) * maxDistortion * distortionFactor;

            // Add localized noise effect
            let noiseVal = noise(x * noiseScale, y * noiseScale, frameCount * 0.02);
            let noiseOffsetX = map(noiseVal, 0, 1, -noiseStrength, noiseStrength) * distortionFactor;
            let noiseOffsetY = map(noise(x * noiseScale, y * noiseScale, 1000 + frameCount * 0.02), 0, 1, -noiseStrength, noiseStrength) * distortionFactor;

            // Combine distortion and noise
            distortionX += noiseOffsetX;
            distortionY += noiseOffsetY;

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