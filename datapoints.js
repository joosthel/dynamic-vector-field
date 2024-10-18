let points = [];
const numPoints = 20;
let connectionRadius;
let minRadius = 150;
let maxRadius = 700;
let draggedPoint = null;
let noiseScale = 0.008;
let noiseStrength = 2;

// Custom texts for points (unchanged)
const customTexts = [
    "3D-Visualization", "Generative Design", 
    "Data Visualization", "Immersive Experience Design", 
    "Spatial Systems", "Computational Design", 
    "Augmented Reality", "Data Sculpting", 
    "Advanced Design", "Procedural Modelling", 
    "Algorithmic Design", "Digital Twins", 
    "Custom Prototyping", "Data Mapping", 
    "Visualization", "Generative Art", 
    "Immersive Data", "Spatial Mapping", 
    "Visual Analytics", "Digital Fabrication"
];

function setup() {
  let CanvasWidth = windowWidth;
  let CanvasHeight = windowHeight;
  createCanvas(CanvasWidth, CanvasHeight);

  calculateConnectionRadius();

  frameRate(60);
  textAlign(LEFT, CENTER);

  // Create initial points with custom texts
  for (let i = 0; i < numPoints; i++) {
    let text = i < customTexts.length ? customTexts[i] : `Point ${i + 1}`;
    points.push(new Point(random(width), random(height), text));
  }
}

function draw() {
  background('#FFFFFF');
  
  // Update and display points
  for (let point of points) {
    if (point !== draggedPoint) {
      point.move();
    }
    point.display();
  }
  
  // Check for connections and draw them
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let d = dist(points[i].x, points[i].y, points[j].x, points[j].y);
      if (d < connectionRadius) {
        stroke(100, 100, 100, map(d, 0, connectionRadius, 255, 0));
        strokeWeight(1.5);
        line(points[i].x, points[i].y, points[j].x, points[j].y);
        points[i].connectedPoints.add(points[j]);
        points[j].connectedPoints.add(points[i]);
      } else {
        points[i].connectedPoints.delete(points[j]);
        points[j].connectedPoints.delete(points[i]);
      }
    }
  }
}

class Point {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.connectedPoints = new Set();
  }
  
  move() {
    let dx = map(noise(this.noiseOffsetX), 0, 1, -1, 1) * noiseStrength;
    let dy = map(noise(this.noiseOffsetY), 0, 1, -1, 1) * noiseStrength;
    
    this.x += dx;
    this.y += dy;
    
    // Wrap around edges
    this.x = (this.x + width) % width;
    this.y = (this.y + height) % height;
    
    this.noiseOffsetX += noiseScale;
    this.noiseOffsetY += noiseScale;
  }
  
  display() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, 12);
    fill(0);
    text(this.text, this.x, this.y + 17.5);
  }
  
  isOver(px, py) {
    return dist(px, py, this.x, this.y) < 6;
  }
}

function calculateConnectionRadius() {
  let size = min(width, height);
  connectionRadius = map(size, 300, 1920, minRadius, maxRadius);
  connectionRadius = constrain(connectionRadius, minRadius, maxRadius);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateConnectionRadius();
}

function mousePressed() {
  for (let point of points) {
    if (point.isOver(mouseX, mouseY)) {
      draggedPoint = point;
      break;
    }
  }
}

function mouseDragged() {
  if (draggedPoint) {
    let dx = mouseX - draggedPoint.x;
    let dy = mouseY - draggedPoint.y;
    draggedPoint.x = mouseX;
    draggedPoint.y = mouseY;
    
    // Move connected points
    for (let connectedPoint of draggedPoint.connectedPoints) {
      connectedPoint.x += dx * 0.3; 
    }
  }
}

function mouseReleased() {
  draggedPoint = null;
}