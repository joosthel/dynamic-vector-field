let vectors = [];
let influenceRadius = 400;
let noiseScale = 0.002;
let noiseSpeed = 0.002;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let x = 20; x < width; x += 50) {
        for (let y = 20; y < height; y += 50) {
            vectors.push(new _Vector(x, y));
        }
    }
}

function draw() {
    background(255);
    
    let time = frameCount * noiseSpeed;
    
    for (let vec of vectors) {
        vec.updateAngle(noiseScale, time);
        vec.calc_move(mouseX, mouseY, influenceRadius);
        vec.print();
    }

    noFill();
    stroke(223);
    ellipse(mouseX, mouseY, influenceRadius * 2);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    vectors = [];
    for (let x = 20; x < width; x += 50) {
        for (let y = 20; y < height; y += 50) {
            vectors.push(new _Vector(x, y));
        }
    }
}

class _Vector {
    constructor(x, y) {
        this.pos = { x: x, y: y };
        this.dir = { x: 0, y: 0 };
        this.length = 17.5;
        this.angle = 0;
    }

    updateAngle(noiseScale, time) {
        let noiseValue = noise(this.pos.x * noiseScale, this.pos.y * noiseScale, time);
        this.angle = map(noiseValue, 0, 1, 0, TWO_PI);
    }

    calc_move(targetX, targetY, influenceRadius) {
        let dx = targetX - this.pos.x;
        let dy = targetY - this.pos.y;
        let distance = sqrt(dx*dx + dy*dy);

        if (distance < influenceRadius) {
            // Calculate influence based on distance
            let influence = this.calculateInfluence(distance, influenceRadius);
            
            // Gradually change angle based on influence
            let targetAngle = atan2(dy, dx);
            this.angle = lerp(this.angle, targetAngle, influence);
        }

        this.dir.x = this.pos.x + cos(this.angle) * this.length;
        this.dir.y = this.pos.y + sin(this.angle) * this.length;
    }

    calculateInfluence(distance, maxDistance) {
        // This creates a curve where influence increases as the arrow gets closer
        return 1 - Math.pow(distance / maxDistance, 2);
    }

    print() {
        stroke('#000000');
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.dir.x, this.dir.y);
        
        push();
        translate(this.dir.x, this.dir.y);
        rotate(this.angle);
        fill('#000000');
        triangle(0, 0, -5, -2.5, -5, 2.5);
        pop();
    }
}
