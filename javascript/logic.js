//Script order:
//--------------
//classes
//variables
//LOGIC <- You are here!
//input

//This script handles all the application's logic.

setCanvasSizeToBrowserDimensions();
//LOOP (A method that gets called 60 times every second.)
window.requestAnimationFrame(loop);
function loop() {
  window.requestAnimationFrame(loop);

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  //draw sky
  context.fillStyle = skyGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  //update water modulation variable
  waterPhaseValue += (1 / 60) * waveSpeedMultiplyer;

  checkCircleCollisionsAndMouse();
  calculateAndDrawWater(waterPhaseValue);
  calculateAndDrawCircles(waterPhaseValue, isEmptying);

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const wH =
      getWaterHeight(bubbles[i].position.x, 100) +
      canvasHeight * waterLineHeightFraction;
    if (bubbles[i].position.y > wH) {
      bubbles[i].addBuoyancy(new vector2(0, -1));
      bubbles[i].damp(waterDampVal);
      bubbles[i].updatePosition();
    } else {
      bubbles.splice(i, 1);
    }
    bubbles[i].draw();
  }
}

createBubbles();

//CALCULATE AND DRAW WATER
function calculateAndDrawWater(waterPhaseValue) {
  context.lineWidth = 1;
  context.fillStyle = waterGradient;
  context.beginPath();
  let sineHeight = getWaterHeight(0, waterPhaseValue);
  context.moveTo(0, canvasHeight * waterLineHeightFraction + sineHeight);
  for (let i = 0; i < canvasWidth; i += sineStepSize) {
    sineHeight = getWaterHeight(i, waterPhaseValue);
    context.lineTo(i, canvasHeight * waterLineHeightFraction + sineHeight);
  }
  sineHeight = getWaterHeight(canvasWidth, waterPhaseValue);

  context.lineTo(
    canvasWidth,
    canvasHeight * waterLineHeightFraction + sineHeight
  );

  context.lineTo(canvasWidth, canvasHeight);
  context.lineTo(0, canvasHeight);
  context.closePath();

  context.fill();
}

//CHECK COLLISION AND MOUSE
function checkCircleCollisionsAndMouse() {
  for (let i = 0; i < circles.length; i++) {
    c1 = circles[i];

    //Check mouse
    if (mouseIsDown && !isEmptying) {
      const mag = vector2.distance(c1.position, mousePos);
      if (mag <= mouseAffectRadius) {
        const circleToMouseV = new vector2(
          mousePos.x - c1.position.x,
          mousePos.y - c1.position.y
        );
        const dirV = new vector2(
          circleToMouseV.x / mag,
          circleToMouseV.y / mag
        );
        mouseForce = new vector2(
          (dirV.x * mouseforceStrength) / clamp(mag, 10, 10000),
          (dirV.y * mouseforceStrength) / clamp(mag, 10, 10000)
        );
        c1.addForce(mouseForce);
      }
    }

    for (let j = 0; j < circles.length; j++) {
      c2 = circles[j];
      if (c1 == c2) {
        continue;
      }
      const distToOther = vector2.distance(c1.position, c2.position);
      //If intersecting
      if (distToOther < c1.radius + c2.radius) {
        const magnitude = vector2.distance(c1.position, c2.position);
        const c1ToC2V = new vector2(
          c2.position.x - c1.position.x,
          c2.position.y - c1.position.y
        );
        const dirVector = new vector2(
          (-c1ToC2V.x / magnitude) * 0.5,
          (-c1ToC2V.y / magnitude) * 0.5
        );
        const overlapDistance = c1.radius + c2.radius - magnitude;
        const massInfluence = c2.mass / c1.mass;
        c1.addForce(
          new vector2(
            dirVector.x * overlapDistance * massInfluence * 0.5,
            dirVector.y * overlapDistance * massInfluence * 0.5
          )
        );
      }
    }
  }
}

//CALCULATE AND DRAW CIRCLES
function calculateAndDrawCircles(waterPhaseValue, isEmptying) {
  circles.forEach((circle) => {
    //A y-position from where the water will modulate.
    waterLineHeightInPixels = canvasHeight * waterLineHeightFraction;

    //The moudlated water height
    const waterHeight = getWaterHeight(circle.position.x, waterPhaseValue);

    //Top-side of the cirlce's distance to the water.
    const circleTopDistToWaterLine =
      waterLineHeightInPixels + waterHeight - circle.position.y + circle.radius;
    //Bottom-side of the cirlce's distance to the water.
    const circleBottomDistToWaterLine =
      waterLineHeightInPixels + waterHeight - circle.position.y - circle.radius;

    //Check if circle is above, below or in between sky and water. Add corresponding forces depending on where the circle is.
    if (circleBottomDistToWaterLine > 0) {
      //Above water
      circle.addForce(new vector2(0, 1)); //Gravity
      circle.damp(airDampVal);
    } else if (circleTopDistToWaterLine < 0) {
      //Below water
      circle.addBuoyancy(new vector2(0, -1));
      circle.damp(waterDampVal);
    } else {
      //In-between
      //Calculate how much the circle is under water.
      const fractionSubmerged = Math.abs(
        circleBottomDistToWaterLine / (circle.radius * 2)
      );
      //Add corresponding forces to part of the circle.
      circle.addBuoyancy(new vector2(0, -1 * fractionSubmerged));
      circle.damp(waterDampVal * fractionSubmerged);
      circle.addForce(new vector2(0, 1 * (1 - fractionSubmerged)));
      circle.damp(airDampVal * (1 - fractionSubmerged));
    }

    //Constrain circles to canvas borders
    //Bottom border
    if (circle.position.y + circle.radius > canvasHeight && !isEmptying) {
      circle.position.y = canvasHeight - circle.radius;
    }
    //Left border
    if (circle.position.x - circle.radius < 0) {
      circle.position.x = 0 + circle.radius;
    }
    //Right border
    if (circle.position.x + circle.radius > canvasWidth) {
      circle.position.x = canvasWidth - circle.radius;
    }

    //Uppdate the circles position based on the new velocity modified by the forces above.
    circle.updatePosition();

    //Set color based on the y-position of the circle.
    const colorVal =
      canvasHeight * (1 - waterLineHeightFraction * 1.4) -
      (circle.position.y / canvasHeight) *
        (canvasHeight * (1 - waterLineHeightFraction * 1.4));
    const r = colorVal - 60;
    const g = 0;
    const b = colorVal + 60;
    circle.draw(r, g, b);
  });
}

//GET SINE HEIGHT
function getWaterHeight(xPos, waterPhaseValue) {
  const sinFirst = Math.sin(xPos / waveLength + waterPhaseValue) * waveHeight;

  const sinSecond =
    Math.sin((xPos / waveLength) * 3 + waterPhaseValue * 4) * waveHeight * 0.1;

  const sinThird =
    Math.sin((xPos / waveLength) * 3 + waterPhaseValue * 10) * waveHeight * 0.1;
  return sinFirst + sinSecond + sinThird;
}

function addCircleToCanvas(xPos, yPos) {
  if (!isEmptying) {
    circles.push(new circle(xPos, yPos, Math.random() * 30 + 10, 0.03));
  }
}

function empty() {
  isEmptying = true;
  circles.forEach((circle) => {
    circle.mass *= 5;
  });
  setTimeout(() => {
    isEmptying = false;
    circles = [];
  }, 2000);
}

function setCanvasSizeToBrowserDimensions() {
  canvasHeight = window.innerHeight;
  canvasWidth = window.innerWidth;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function createBubbles() {
  for (let i = 0; i < bubblesAmount; i++) {
    bubbles.push(
      new bubble(
        Math.random() * canvasWidth,
        canvasHeight + Math.random() * 500,
        Math.random() * 6 + 2,
        0.03
      )
    );
  }
}
