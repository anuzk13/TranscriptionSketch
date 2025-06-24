/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 *
 * Jenna deBoisblanc
 * jdeboi.com
 *
 */

let pMapper;
let quadMap, triMap, lineMap, bezMap, polyMap;

let sel;
let mode = "sketch";
let myFont;
let img;
let c;

let speechRecognition;
let isListening = false;

// Typography sketch variables

let textToShow = "Habla!"; 
var typographyFont; // to be preloadded in the main sketch

function preload() {
  myFont = loadFont("assets/Roboto.ttf");
  typographyFont = loadFont("data/FiraSansCompressed-Bold.otf"); // For the typography sketch
}

function setup() {

  setupJoycon();
  setupSpeechRecognition();
  
  // typography sketch setup
  colors = [color(65, 105, 185), color(245, 95, 80), color(15, 233, 118)];
  setupTypographyText(1000, 200, typographyFont, textToShow, 150);

  // demo setup
  c = color(255, 204, 0);
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(myFont);

  // create mapper object
  pMapper = createProjectionMapper(this);
  quadMap1 = pMapper.createQuadMap(1000, 200);
  quadMap2 = pMapper.createQuadMap(1000, 200);
  quadMap3 = pMapper.createQuadMap(1000, 200);
  // loads calibration in the "maps" directory
  pMapper.load("maps/map.json");

}

function draw() {
  background(0);
  // drawCoordsWebGL();
  quadMap1.displaySketch(drawTypographySketch);
  quadMap2.displaySketch(drawTypographySketch);
  quadMap3.displaySketch(drawTypographySketch);
  
}

function drawCoordsWebGL() {
  push();
  // Adjust text coordinates as well, or they will also be off-center
  for (let i = 0; i < 1000; i += 50) {
    text(i, i - width / 2, 150 - height / 2); // Adjust text X and Y
    text(i, 150 - width / 2, i - height / 2); // Adjust text X and Y
  }
  fill(c);
  // Adjust ellipse coordinates to align with mouse in WEBGL context
  ellipse(mouseX - width / 2, mouseY - height / 2, 50);
  pop();
}

function drawCoords(pg) {
  pg.clear();
  pg.push();
  pg.background(0, 255, 0);
  pg.fill(0);

  for (let i = 0; i < 1000; i += 50) {
    pg.text(i, i, 150);
    pg.text(i, 150, i);
  }
  pg.fill(c);
  pg.ellipse(mouseX, mouseY, 50);
  pg.pop();
}

function dots(pg) {
  randomSeed(0);
  pg.clear();
  pg.push();
  pg.background("pink");
  pg.fill(255);
  pg.noStroke();
  for (let i = 0; i < 60; i++) {
    pg.ellipse(random(width), random(height), random(10, 80));
  }
  pg.pop();
}

function rainbow(pg) {
  pg.clear();
  pg.push();
  pg.background("pink");
  pg.colorMode(HSB, 255);

  for (let i = 0; i < 1000; i++) {
    pg.stroke(i % 255, 255, 255);
    pg.line(i, 0, i, 300);
  }
  pg.pop();
}

function keyPressed() {
  switch (key) {
    case "c":
      pMapper.toggleCalibration();
      break;
    case "f":
      let fs = fullscreen();
      fullscreen(!fs);
      break;
    case "l":
      pMapper.load("maps/map.json");
      break;

    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function displayFrameRate() {
  fill(255);
  noStroke();
  text(round(frameRate()), -width / 2 + 15, -height / 2 + 50);
}


function setupSpeechRecognition() {
  // Initialize speech recognition
  speechRecognition = new webkitSpeechRecognition() || new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "es-MX";

  // Handle the result event
  speechRecognition.onresult = function (event) {
    if (event.results.length > 0) {
      // results.length indicates the latest script built
      textToShow = event.results[event.results.length - 1][0].transcript
        .split(" ")
        .at(-1);
      setupTypographyText(1000, 200, typographyFont, textToShow, 150);
    }
  };
}

function setupJoycon() {
  const controllers = Joycon.controllers;

  controllers.on.move("left-joystick", (value) => {
    leftJoystickX = value.x;
    leftJoystickY = value.y;
  });

  controllers.on.move("right-joystick", (value) => {
    rightJoystickX = value.x;
    rightJoystickY = value.y;
  });

  controllers.on.press('right-shoulder', (value) => {
    // 1 is press 0 is release
    if (value==1){
      if (!isListening) {
        speechRecognition.start();
        isListening = true;
      }
    } else if (value == 0) {
        if (isListening) {
          speechRecognition.stop();
          isListening = false;
        }
    }
  });
  
  var drawModes = ['x', 'y', 'a', 'b'];
  for (let i = 1; i <5; i++) {
    var button = drawModes[i-1];
     controllers.on.press(button, (value) => {
        if (value==1){
          drawMode = i;
        }
    });
  }
 
}