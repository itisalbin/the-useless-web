//Script order:
//--------------
//CLASSES <- You are here!
//variables
//logic
//input

//This script defines the application's classes.

class vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static distance(v1, v2) {
    return Math.sqrt(
      (v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y)
    );
  }
}

class circle {
  constructor(startPosX, startPosY, radius, massRadiusRatio) {
    this.radius = radius;
    this.position = new vector2(startPosX, startPosY);
    this.lastPosition = this.position;
    this.velocity = new vector2(0, 0);
    this.mass = radius * massRadiusRatio;
  }

  draw(r, g, b) {
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  addForce(forceVector) {
    this.velocity.x += forceVector.x;
    this.velocity.y += forceVector.y;
  }

  addBuoyancy(forceVector) {
    this.velocity.x += forceVector.x;
    this.velocity.y += forceVector.y + this.mass;
  }

  damp(dampAmount) {
    this.velocity.x *= 1 - dampAmount;
    this.velocity.y *= 1 - dampAmount;
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class bubble {
  constructor(startPosX, startPosY, radius, massRadiusRatio) {
    this.radius = radius;
    this.position = new vector2(startPosX, startPosY);
    this.lastPosition = this.position;
    this.velocity = new vector2(0, 0);
    this.mass = radius * massRadiusRatio;
  }

  draw(r, g, b) {
    context.strokeStyle = `rgba(255, 255, 255, ${0.6 - this.mass * this.mass})`;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    context.stroke();
  }

  addBuoyancy(forceVector) {
    this.velocity.x += forceVector.x;
    this.velocity.y += forceVector.y + this.mass;
  }

  damp(dampAmount) {
    this.velocity.x *= 1 - dampAmount;
    this.velocity.y *= 1 - dampAmount;
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
