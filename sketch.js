// Transcription code
// https://medium.spatialpixel.com/sounds-bd05429aba38
// typography code
// http://www.generative-gestaltung.de/2/sketches/?01_P/P_3_2_5_01

let speechRecognition;
let isListening = false;
let textToShow = "Habla!";

// Typography
var font;
var drawMode = 1;
var fontSize = 250;
var padding = 10;
var nOff = 0;
var pointDensity = 8;
var colors;
var textImg;
let leftJoystickX = 0;
let leftJoystickY = 0;
let rightJoystickX = 0;
let rightJoystickY = 0;

function preload() {
  font = loadFont("data/FiraSansCompressed-Bold.otf");
}

function setup() {
  createCanvas(1600, 800);
  frameRate(25);
  rectMode(CENTER);

  setupJoycon();
  setupSpeechRecognition();

  colors = [color(65, 105, 185), color(245, 95, 80), color(15, 233, 118)];
  pixelDensity(1);

  setupText(textToShow);
}

function draw() {
  background(255);
  drawText();
}

function keyPressed() {
  if (keyCode === 32) {
    // Spacebar
    if (!isListening) {
      speechRecognition.start();
      isListening = true;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    // Spacebar
    if (isListening) {
      speechRecognition.stop();
      isListening = false;
    }
  }
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
      setupText(textToShow);
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
    console.log(i)
     controllers.on.press(button, (value) => {
        if (value==1){
          drawMode = i;
          console.log(drawMode)
        }
    });
  }
 
}

function drawText() {
  nOff++;
  
  let joystickMagnitude = dist(0, 0, leftJoystickX, leftJoystickY);
  let joystickAngle = atan2(leftJoystickY, leftJoystickX);
  let scaleFactor = map(joystickMagnitude, 0, 1, 0.5, 2.0); 

  for (var x = 0; x < textImg.width; x += pointDensity) {
    for (var y = 0; y < textImg.height; y += pointDensity) {
      // Calculate the index for the pixels array from x and y
      var index = (x + y * textImg.width) * 4;
      // Get the red value from image
      var r = textImg.pixels[index];

      if (r < 128) {
        if (drawMode == 1) {
          strokeWeight(1);

          var noiseFac = map(rightJoystickY, -1, 1, 0, 1);
          var lengthFac = map(joystickMagnitude, 0, 1, 0.01, 0.3);

          var num = noise((x + nOff) * noiseFac, y * noiseFac);
          if (num < 0.6) {
            stroke(colors[0]);
          } else if (num < 0.7) {
            stroke(colors[1]);
          } else {
            stroke(colors[2]);
          }

          push();
          translate(x, y);
          // Apply the rotation based on joystick angle
          rotate(joystickAngle);
          // Apply the length based on joystick magnitude
          line(0, 0, fontSize * lengthFac, 0);
          pop();
        }

        if (drawMode == 2) {
          noStroke();
          push();
          translate(x, y);
          
          var noiseXOffset = map(leftJoystickX, -1, 1, -50, 50); // Map joystick X to a range for noise offset
          // Use joystick Y to influence noise offset, creating vertical "drift" or pattern shift
          var noiseYOffset = map(leftJoystickY, -1, 1, -50, 50); // Map joystick Y to a range for noise offset

          var num = noise((x + nOff + noiseXOffset) / 10, (y / 10) + noiseYOffset / 100); // Add noise offsets

          if (num < 0.6) {
            fill(colors[0]);
          } else if (num < 0.7) {
            fill(colors[1]);
          } else {
            fill(colors[2]);
          }

          // Use joystick magnitude to influence the overall size of ellipses
          var w = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 20 * scaleFactor;
          var h = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 10 * scaleFactor;

          // Rotate the ellipses based on the joystick angle
          rotate(joystickAngle);
          ellipse(0, 0, w, h);
          pop();
        }

        if (drawMode == 3) {
          noStroke();

          var num = random(1);

          if (num < 0.6) {
            fill(colors[0]);
          } else if (num < 0.7) {
            fill(colors[1]);
          } else {
            fill(colors[2]);
          }

          push();
          scale(scaleFactor);
          beginShape();
          for (var i = 0; i < 3; i++) {
            var ox =
              (noise((i * 1000 + x - nOff) / 30, (i * 3000 + y + nOff) / 30) -
                0.5) *
              pointDensity *
              6;
            var oy =
              (noise((i * 2000 + x - nOff) / 30, (i * 4000 + y + nOff) / 30) -
                0.5) *
              pointDensity *
              6;
            vertex(x + ox, y + oy);
          }
          endShape(CLOSE);
          pop();
        }

        if (drawMode == 4) {
          stroke(colors[0]);
          strokeWeight(3);

          let baseOffsetX = map(leftJoystickX, -1, 1, -5, 5); // Small offset for base points
          let baseOffsetY = map(leftJoystickY, -1, 1, -5, 5);

          point(x - 10 + baseOffsetX, y - 10 + baseOffsetY);
          point(x + baseOffsetX, y + baseOffsetY);
          point(x + 10 + baseOffsetX, y + 10 + baseOffsetY);

          for (var i = 0; i < 5; i++) {
            if (i == 1) {
              stroke(colors[1]);
            } else if (i == 3) {
              stroke(colors[2]);
            }

            // Introduce joystick influence into the noise-based offsets for points
            let joystickNoiseFactor = map(joystickMagnitude, 0, 1, 0.5, 1.5); // Adjust noise "amplitude"
            let joystickNoiseShiftX = map(leftJoystickX, -1, 1, -20, 20); // Shift noise pattern
            let joystickNoiseShiftY = map(leftJoystickY, -1, 1, -20, 20);

            if (i % 2 == 0) {
              var ox = noise((10000 + i * 100 + x - nOff + joystickNoiseShiftX) / 10) * 10 * joystickNoiseFactor;
              var oy = noise((20000 + i * 100 + x - nOff + joystickNoiseShiftY) / 10) * 10 * joystickNoiseFactor;
              point(x + ox, y + oy);
            } else {
              var ox = noise((30000 + i * 100 + x - nOff + joystickNoiseShiftX) / 10) * 10 * joystickNoiseFactor;
              var oy = noise((40000 + i * 100 + x - nOff + joystickNoiseShiftY) / 10) * 10 * joystickNoiseFactor;
              point(x - ox, y - oy);
            }
          }
        }
      }
    }
  }
}

function setupText(textTyped) {
  // create an offscreen graphics object to draw the text into
  textImg = createGraphics(width, height);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textFont(font);
  textImg.textSize(fontSize);
  textImg.text(textTyped, 100, fontSize + 50);
  textImg.loadPixels();
}
