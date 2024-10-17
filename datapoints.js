let points = [];
const numPoints = 20;
let connectionRadius;
let minRadius = 150;
let maxRadius = 700;

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
    point.move();
    point.display();
  }
  
  // Check for connections
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let d = dist(points[i].x, points[i].y, points[j].x, points[j].y);
      if (d < connectionRadius) {
        stroke(100, 100, 100, map(d, 0, connectionRadius, 255, 0));
        strokeWeight(1.5);
        
        line(points[i].x, points[i].y, points[j].x, points[j].y);
      }
    }
  }
}

class Point {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.speed = 1;
    this.direction = p5.Vector.random2D();
  }
  
  move() {
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    
    // Bounce off edges
    if (this.x < 0 || this.x > width) this.direction.x *= -1;
    if (this.y < 0 || this.y > height) this.direction.y *= -1;
  }
  
  display() {
    fill(0);
    noStroke();
    ellipse(this.x, this.y, 12);
    fill(0);
    text(this.text, this.x, this.y + 17.5);
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