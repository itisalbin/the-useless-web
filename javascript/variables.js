//Script order:
//--------------
//classes
//VARIABLES <- You are here!
//logic
//input

//This script holds most of the variables for the application's logic.
//(Some are hard coded into the logic, where convenient.)

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

let mousePos = new vector2(10000, 10000);
let circles = [];
let bubbles = [];
let waterPhaseValue = 0;
let mouseIsDown = false;
let isEmptying = false;

//canvas
let canvasHeight = window.innerHeight;
let canvasWidth = window.innerWidth;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

//damping
const airDampVal = 0.01;
const waterDampVal = 0.1;

//bubbles
const bubblesAmount = 10;

//water shape
const waterLineHeightFraction = 0.4;
const waveHeight = 5;
const waveSpeedMultiplyer = 0.75;
const waveLength = canvasWidth * 0.5;
const sineStepSize = canvasWidth / 10;

//water color
const waterGradient = context.createLinearGradient(0, 0, 0, 1000);
waterGradient.addColorStop(0.2, '#00FFFF');
waterGradient.addColorStop(0.5, '#0044AA');
waterGradient.addColorStop(1, 'black');

//sky color
const skyGradient = context.createLinearGradient(0, 0, 0, canvasHeight * 0.5);
skyGradient.addColorStop(0, '#4488FF');
skyGradient.addColorStop(1, 'white');

//mouse
const mouseforceStrength = -50;
const mouseAffectRadius = 100;
const instantiateCircleOffsetDistance = (Math.random() - 0.5) * 2;
