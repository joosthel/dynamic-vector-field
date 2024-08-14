let font;
let pg;
let tX, tY;


let maxDistortion = 50;
let distortionRadius = 200;
let falloffPower = 2;
let noiseScale = 0.05;
let noiseStrength = 200;

function setup() {
    let CanvasWidth = windowWidth;
    let CanvasHeight = windowHeight;
    createCanvas(CanvasWidth, CanvasHeight);
    pg = createGraphics(CanvasWidth, CanvasHeight);
    frameRate(60);
    tX = 120;
    tY = 120;
    
    // Initial draw of all tiles
    drawAllTiles();
}

function drawAllTiles() {
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
    let tileW = floor(width / tilesX);
    let tileH = floor(height / tilesY);

    noSmooth(); // no smoothing while rendering


    for (let y = 0; y < tilesY; y++) {
        for (let x = 0; x < tilesX; x++) {
            image(pg, x * tileW, y * tileH, tileW, tileH, x * tileW, y * tileH, tileW, tileH);
        }
    }
}

function draw() {
    let tilesX = tX;
    let tilesY = tY;
    let tileW = width / tilesX;
    let tileH = height / tilesY;

    let mousePos = createVector(mouseX, mouseY);

    // Calculate the range of tiles to update
    let startX = max(0, floor((mouseX - distortionRadius) / tileW));
    let endX = min(tilesX - 1, ceil((mouseX + distortionRadius) / tileW));
    let startY = max(0, floor((mouseY - distortionRadius) / tileH));
    let endY = min(tilesY - 1, ceil((mouseY + distortionRadius) / tileH));

    for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
            let tileCenter = createVector(x * tileW + tileW / 2, y * tileH + tileH / 2);
            let distToMouse = p5.Vector.dist(tileCenter, mousePos);
            
            if (distToMouse <= distortionRadius) {
                let distortionFactor = map(distToMouse, 0, distortionRadius, 1, 0);
                distortionFactor = constrain(distortionFactor, 0, 1);
                distortionFactor = pow(distortionFactor, falloffPower);
                
                let angle = atan2(tileCenter.y - mouseY, tileCenter.x - mouseX);
                
                let distortionX = cos(angle) * maxDistortion * distortionFactor;
                let distortionY = sin(angle) * maxDistortion * distortionFactor;

                let noiseVal = noise(x * noiseScale, y * noiseScale, frameCount * 0.02);
                let noiseOffsetX = map(noiseVal, 0, 1, -noiseStrength, noiseStrength) * distortionFactor;
                let noiseOffsetY = map(noise(x * noiseScale, y * noiseScale, 1000 + frameCount * 0.02), 0, 1, -noiseStrength, noiseStrength) * distortionFactor;

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
}