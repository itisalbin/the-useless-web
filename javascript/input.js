//Script order:
//--------------
//classes
//variables
//logic
//INPUT <- You are here!

//This script detects and handles all the inputs from the user.

//***MOUSE***
//MOUSE DOWN
canvas.addEventListener('mousedown', () => {
  mouseIsDown = true;
});
//MOUSE UP
canvas.addEventListener('mouseup', () => {
  mouseIsDown = false;
});
//MOUSE MOVE
canvas.addEventListener('mousemove', (e) => {
  mousePos = getMousePos(canvas, e);
});

//Get the position of the mouse relative to the canvas
function getMousePos(canvas, mouseEvent) {
  var rect = canvas.getBoundingClientRect();
  return new vector2(
    mouseEvent.clientX - rect.left,
    mouseEvent.clientY - rect.top
  );
}

//***TOUCH***
//TOUCH START
canvas.addEventListener('touchstart', (e) => {
  mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvas.dispatchEvent(mouseEvent);
  tapHandler(e);
});
//TOUCH END
canvas.addEventListener('touchend', () => {
  var mouseEvent = new MouseEvent('mouseup', {});
  canvas.dispatchEvent(mouseEvent);
});
//TOUCH MOVE
canvas.addEventListener('touchmove', (e) => {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvas.dispatchEvent(mouseEvent);
});

// Get the position of a touch relative to the canvas
function getTouchPos(canvas, touchEvent) {
  var rect = canvas.getBoundingClientRect();
  return new vector2(
    touchEvent.touches[0].clientX - rect.left,
    touchEvent.touches[0].clientY - rect.top
  );
}

//DOUBLE CLICK
canvas.addEventListener('dblclick', () => {
  addCircleToCanvas(mousePos.x + instantiateCircleOffsetDistance, -100);
  removeStartText();
});

//dblclick doesn't seem to work (on touch) if preventing scrolling, this creates a simulated double tap.
let tappedTwice = false;
function tapHandler(event) {
  if (!tappedTwice) {
    tappedTwice = true;
    setTimeout(function () {
      tappedTwice = false;
    }, 300);
    return false;
  }
  event.preventDefault();
  addCircleToCanvas(mousePos.x + instantiateCircleOffsetDistance, -100);
  removeStartText();
}

// Prevent scrolling when touching the canvas
document.body.addEventListener(
  'touchstart',
  (e) => {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  { passive: false }
);
document.body.addEventListener(
  'touchend',
  (e) => {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  { passive: false }
);
document.body.addEventListener(
  'touchmove',
  (e) => {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  { passive: false }
);

const emptyButton = document.querySelector('button');
emptyButton.addEventListener('click', () => {
  empty();
  createBubbles();
});

function removeStartText() {
  const textContainer = document.querySelector('.text-container');
  if (!textContainer.classList.contains('fade')) {
    textContainer.classList.add('fade');
    setTimeout(() => {
      textContainer.style.display = 'none';
    }, 1000);
  }
  const emptyButton = document.querySelector('button');
  if (!emptyButton.classList.contains('fade-up')) {
    setTimeout(() => {
      emptyButton.classList.add('fade-up');
    }, 2000);
  }
}

window.onresize = () => {
  setCanvasSizeToBrowserDimensions();
};
