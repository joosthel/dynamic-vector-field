// Moving voronoi tiles on canvas, moving and changeing size

p5.disableFriendlyErrors = true;

const NUM = 50;
const HALFPI = Math.PI*0.5
const RAND = (min, max) => Math.random() * (max - min) + min // .randomUniform

let W, H, polygons, voronoi, positions, velocities, colors;

function setup() {
  ctx = canvas.getContext("2d");
  [W, H] = [windowWidth, windowHeight];
  createCanvas(W, H);
  frameRate(60);
  strokeWeight(2)
  fill('#000')
  //noStroke()

  positions = d3.range(NUM).map(_ => Float64Array.from({length: 2}, (_, i) => Math.random() * (i & 1 ? H : W)))
  velocities = d3.range(NUM).map(_ => Float64Array.from({length: 2}, _ => RAND(-0.1, 0.1) ));
  voronoi = d3.voronoi().extent([[0, 0],[W, H]]);
}


function draw() {
  //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  background("#000");
  
  polygons = voronoi(positions).polygons()

  for (let i = 0; i < NUM; i++) {    
    
    // EULER
    pos = positions[i]
    vel = velocities[i]
    vel[0] += RAND(-0.1, 0.1)
    vel[1] += RAND(-0.1, 0.1)
    pos[0] += vel[0]
    pos[1] += vel[1]
    vel[0] *= 0.99
    vel[1] *= 0.99

    // WALLS
    if (pos[0] >= W-4 || pos[0] <= 4) vel[0] *= -1 
    if (pos[1] >= H-4 || pos[1] <= 4) vel[1] *= -1
    
    
    // ALGO
    vertices = polygons[i].map(v => createVector(v[0], v[1]));
    rverts = roundCorners(vertices, 20);
    
    
    // RENDER (cell)
    push()
    fill(255)
    noStroke()
    beginShape();
    rverts.map(v => vertex(v.x, v.y));
    endShape(CLOSE);
    pop()
    
    // RENDER (site)
    point(pos[0], pos[1]);
    
  }
    
 
  //text(frameRate(), 20, 20);

}


function roundCorners(verts, m) {
  
  const P = [];
  const N = verts.length;
  const n = 15;
  
 
  for (let i = 0; i < N; i++) {
    
    sv = verts[(i+N-2)%N];
    pv = verts[(i+N-1)%N];
    cv = verts[i];
    nv = verts[(i+1)%N];
    ev = verts[(i+2)%N];
    
    let pbis = bisector(sv, pv, cv, m);
    let cbis = bisector(pv, cv, nv, m);
    let nbis = bisector(cv, nv, ev, m);
    
    v = cbis[1];    
        
    minDist = 10000;
    nearest = null;
        
    for (let ibis of [pbis, nbis]) {
      
      isec = intersect(cbis[0], cbis[1], ibis[0], ibis[1])
      if (isec) {
        d = cv.dist(isec)
        if (d < minDist) {
          minDist = d
          nearest = isec
        }
      }
    }
    
    if (nearest) v = nearest;
                
    d1 = p5.Vector.sub(cv, pv).normalize()
    d2 = p5.Vector.sub(nv, cv).normalize() 
            
    op_prev = orthoProjection(d1, cv, v)
    op_next = orthoProjection(d2, cv, v)
            
    dp = p5.Vector.sub(op_prev, v)
    dn = p5.Vector.sub(op_next, v)
        
    a = dn.angleBetween(dp)
    t = a / n //theta
    p = Math.atan2(op_next.y - v.y, op_next.x - v.x) // phi
    r = op_prev.dist(v) // radius
    
    for (let j = n; j > 0; j--) {
      x = Math.cos(t*j+p) * r * 0.9
      y = Math.sin(t*j+p) * r * 0.9
      P.push(createVector(x+v.x, y+v.y))
    }
  }
  return P
}


function orthoProjection(dir, ep, op) {
  
  let dv = p5.Vector.sub(op, ep);
  dir.mult(dv.dot(dir));
    
  return p5.Vector.add(ep, dir)

}


function intersect(p1, p2, p3, p4) {
                
  uA = ((p4.x-p3.x)*(p1.y-p3.y) - (p4.y-p3.y)*(p1.x-p3.x)) / ((p4.y-p3.y)*(p2.x-p1.x) - (p4.x-p3.x)*(p2.y-p1.y)) 
  uB = ((p2.x-p1.x)*(p1.y-p3.y) - (p2.y-p1.y)*(p1.x-p3.x)) / ((p4.y-p3.y)*(p2.x-p1.x) - (p4.x-p3.x)*(p2.y-p1.y))
    
  if (uA >= 0 && uA <= 1 & uB >= 0 & uB <= 1) {
    
    secX = p1.x + (uA * (p2.x-p1.x))
    secY = p1.y + (uA * (p2.y-p1.y))
        
    return createVector(secX, secY)
  }
}


function bisector(pv, cv, nv, m) {
  
  d1 = p5.Vector.sub(cv, pv).normalize()
  d2 = p5.Vector.sub(nv, cv).normalize()
    
  dsum = p5.Vector.add(d1, d2) //sum of directions
        
  s = dsum.mag() / d1.dot(dsum) //speed  
  v = dsum.rotate(-HALF_PI) //vector of bisector
  p = v.setMag(s*m).add(cv) //offsetted vertex 
  
    
  return [cv, p]
}