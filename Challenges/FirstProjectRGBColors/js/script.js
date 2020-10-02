window.addEventListener('load', start);

var redRange = null;
var greenRange = null;
var blueRange = null;
var redText = null;
var greenText = null;
var blueText = null;

function start() {
  inputsMap();
  addEvents();
  range();
}

function inputsMap() {
  redRange = document.querySelector('#rangeRed');
  greenRange = document.querySelector('#rangeGreen');
  blueRange = document.querySelector('#rangeBlue');
  redText = document.querySelector('#textRed');
  greenText = document.querySelector('#textGreen');
  blueText = document.querySelector('#textBlue');
}

function addEvents() {
  redRange.addEventListener('input', getRed);
  greenRange.addEventListener('input', getGreen);
  blueRange.addEventListener('input', getBlue);
}

function getRed(event) {
  redText.value = event.target.value;
  range();
}

function getGreen(event) {
  greenText.value = event.target.value;
  range();
}

function getBlue(event) {
  blueText.value = event.target.value;
  range();
}

function range() {
  var r = redText.value;
  var g = greenText.value;
  var b = blueText.value;

  var divColor = document.querySelector('#colorFrame');
  var rgbColor = 'rgb(' + r + ',' + g + ',' + b + ')';
  divColor.style.backgroundColor = rgbColor;
}
