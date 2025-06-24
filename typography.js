

var drawMode = 1;
var fontSize = 250;
var padding = 10;
var nOff = 0;
var pointDensity = 8;
var colors;
var textImg;

// to be modified in the main sketch
let leftJoystickX = 0;
let leftJoystickY = 0;
let rightJoystickX = 0;
let rightJoystickY = 0;


// Helper function to setup the text mask
// This function needs to be called whenever textToShow changes or when the pg dimensions change.
// textImg needs to be the size of the *input content* for the map,
// not necessarily the main canvas size. Let's make it flexible.
function setupTypographyText(pgWidth, pgHeight, pFont, text, fontS) {
  fontSize = fontS;
  textImg = createGraphics(pgWidth, pgHeight);
  textImg.pixelDensity(1); 
  textImg.background(255);
  textImg.textFont(pFont);
  textImg.textSize(fontSize);
  textImg.textAlign(CENTER, CENTER);
  textImg.text(text, pgWidth/2, pgHeight/2);
  textImg.loadPixels();
}


function drawTypographySketch(pg) {
  pg.clear(); 
  pg.background(0); 

  // textImg may not be loaded, this is done in the main sketch
  if (!textImg || !textImg.pixels || textImg.width === 0 || textImg.height === 0) {
      return;
  }

  nOff++;

  let joystickMagnitude = dist(0, 0, leftJoystickX, leftJoystickY);
  let joystickAngle = atan2(leftJoystickY, leftJoystickX);
  let scaleFactor = map(joystickMagnitude, 0, 1, 0.5, 2.0);

  for (var x = 0; x < textImg.width; x += pointDensity) {
    for (var y = 0; y < textImg.height; y += pointDensity) {
      var index = (x + y * textImg.width) * 4;
      var r = textImg.pixels[index];

      if (r < 128) { 
        pg.push(); 
        pg.translate(x, y);

        if (drawMode == 1) {
          pg.strokeWeight(1);

          var noiseFac = map(rightJoystickY, -1, 1, 0, 1);
          var lengthFac = map(joystickMagnitude, 0, 1, 0.01, 0.3);

          var num = noise((x + nOff) * noiseFac, y * noiseFac);
          if (num < 0.6) {
            pg.stroke(colors[0]);
          } else if (num < 0.7) {
            pg.stroke(colors[1]);
          } else {
            pg.stroke(colors[2]);
          }

          pg.rotate(joystickAngle);
          pg.line(0, 0, fontSize * lengthFac, 0);
        }

        if (drawMode == 2) {
          pg.noStroke();

          var noiseXOffset = map(leftJoystickX, -1, 1, -50, 50);
          var noiseYOffset = map(leftJoystickY, -1, 1, -50, 50);

          var num = noise((x + nOff + noiseXOffset) / 10, (y / 10) + noiseYOffset / 100);

          if (num < 0.6) {
            pg.fill(colors[0]);
          } else if (num < 0.7) {
            pg.fill(colors[1]);
          } else {
            pg.fill(colors[2]);
          }

          var w = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 20 * scaleFactor;
          var h = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 10 * scaleFactor;

          pg.rotate(joystickAngle);
          pg.ellipse(0, 0, w, h);
        }

        if (drawMode == 3) {
          pg.noStroke();

          var num = random(1);

          if (num < 0.6) {
            pg.fill(colors[0]);
          } else if (num < 0.7) {
            pg.fill(colors[1]);
          } else {
            pg.fill(colors[2]);
          }

          pg.scale(scaleFactor);
          pg.beginShape();
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
            pg.vertex(ox, oy);
          }
          pg.endShape(CLOSE);
        }

        if (drawMode == 4) {
          pg.stroke(colors[0]);
          pg.strokeWeight(3);

          let baseOffsetX = map(leftJoystickX, -1, 1, -5, 5);
          let baseOffsetY = map(leftJoystickY, -1, 1, -5, 5);

          pg.point(-10 + baseOffsetX, -10 + baseOffsetY); 
          pg.point(baseOffsetX, baseOffsetY);
          pg.point(10 + baseOffsetX, 10 + baseOffsetY);

          for (var i = 0; i < 5; i++) {
            if (i == 1) {
              pg.stroke(colors[1]);
            } else if (i == 3) {
              pg.stroke(colors[2]);
            }

            let joystickNoiseFactor = map(joystickMagnitude, 0, 1, 0.5, 1.5);
            let joystickNoiseShiftX = map(leftJoystickX, -1, 1, -20, 20);
            let joystickNoiseShiftY = map(leftJoystickY, -1, 1, -20, 20);

            if (i % 2 == 0) {
              var ox = noise((10000 + i * 100 + x - nOff + joystickNoiseShiftX) / 10) * 10 * joystickNoiseFactor;
              var oy = noise((20000 + i * 100 + x - nOff + joystickNoiseShiftY) / 10) * 10 * joystickNoiseFactor;
              pg.point(ox, oy);
            } else {
              var ox = noise((30000 + i * 100 + x - nOff + joystickNoiseShiftX) / 10) * 10 * joystickNoiseFactor;
              var oy = noise((40000 + i * 100 + x - nOff + joystickNoiseShiftY) / 10) * 10 * joystickNoiseFactor;
              pg.point(-ox, -oy); 
            }
          }
        }
        pg.pop();
      }
    }
  }
}
